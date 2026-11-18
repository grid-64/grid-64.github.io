"use strict";
const COLLECTION_REPO = "grid-64/grid-64.github.io";
const COLLECTION_OWNER = "suyihong20060219-cell";
const COLLECTION_BRANCH = "main";
const INDEX_FILE = "dist/collection/index.json";
const PUBLIC_INDEX_VERSION = "13";
const EDITABLE_RECORD_FIELDS = Object.freeze(["car","carZh","maker","scale","series","spec","className","year","number","event","team","driver","item","acquired","collectionReason","collectionReasonZh"]);
const publicRecords = new Map();
const sessionPhotos = new Map();
const archiveRecords = () => publicRecords.size ? [...publicRecords.values()] : RECORDS;
function photoPath(value) {
  return typeof value === "string" && /^collection\/photos\/[a-f0-9-]+\.jpg$/.test(value);
}
function mergeCollectionEdit(previous, entry) {
  const record={...previous,id:entry.id};
  // The form omits intentionally emptied inputs. Only clear the fields it owns.
  for (const field of EDITABLE_RECORD_FIELDS) {
    if (Object.hasOwn(entry,field)) record[field]=entry[field];
    else delete record[field];
  }
  return record;
}
async function loadPublicCollection() {
  if (location.protocol === "file:") return;
  // Revalidate the stable URL so edits stay current and unchanged data can use a 304 response.
  const query = new URLSearchParams({v:PUBLIC_INDEX_VERSION});
  const response = await fetch("./collection/index.json?"+query,{cache:"no-cache",signal:AbortSignal.timeout?.(8000)});
  if (!response.ok) throw Error("Collection index could not be loaded");
  const items = await response.json();
  if (!Array.isArray(items)) throw Error("Invalid collection index");
  items.filter(x=>x && /^[a-f0-9-]{36}$/.test(x.id) && typeof x.car==="string" && photoPath(x.photo)).forEach(x=>publicRecords.set(x.id,{...x,status:"collected"}));
}
function encode(bytes) {
  let raw="";
  for(let i=0;i<bytes.length;i+=8192) raw+=String.fromCharCode(...bytes.subarray(i,i+8192));
  return btoa(raw);
}
async function github(token,path,method="GET",data) {
  const response=await fetch("https://api.github.com"+path,{
    method,headers:{Accept:"application/vnd.github+json",Authorization:"Bearer "+token,"X-GitHub-Api-Version":"2022-11-28",...(data?{"Content-Type":"application/json"}:{})},
    body:data ? JSON.stringify(data):undefined,cache:"no-store",redirect:"error",referrerPolicy:"no-referrer",signal:AbortSignal.timeout(25000)
  });
  if (!response.ok) {const err=Error("GitHub API request failed");err.status=response.status;throw err;}
  return response.json();
}
async function publishRecord(token,entry,photo,baseline) {
  const prefix="/repos/"+COLLECTION_REPO;
  const user=await github(token,"/user");
  if(user.login?.toLowerCase()!==COLLECTION_OWNER.toLowerCase()) throw Error("The token must belong to the collection owner.");
  const refPath=prefix+"/git/ref/heads/"+COLLECTION_BRANCH;
  const ref=await github(token,refPath);
  const head=ref.object.sha;
  const [commit,index]=await Promise.all([
    github(token,prefix+"/git/commits/"+head),
    github(token,prefix+"/contents/"+INDEX_FILE+"?ref="+head)
  ]);
  const items=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(index.content),c=>c.charCodeAt(0))));
  if(!Array.isArray(items)) throw Error("Invalid collection index");
  const pos=items.findIndex(x=>x.id===entry.id);
  if (pos!==-1 && (!baseline || items[pos].revision!==baseline)) throw Error("The record changed on GitHub. Reload before editing it again.");
  const record=mergeCollectionEdit(items[pos],entry);
  record.revision=crypto.randomUUID();
  if (photo) {
    record.photo="collection/photos/"+record.revision+".jpg";
    delete record.thumbnail;
    delete record.previewPhoto;
  }
  if (!photoPath(record.photo)) throw Error("Choose a photo before saving or publishing.");
  if(pos<0) items.push(record);else items[pos]=record;
  const files=[{path:INDEX_FILE,mode:"100644",type:"blob",content:JSON.stringify(items,null,2)+"\n"}];
  if(photo) {
    const blob=await github(token,prefix+"/git/blobs","POST",{encoding:"base64",content:encode(new Uint8Array(await photo.arrayBuffer()))});
    files.push({path:"dist/"+record.photo,mode:"100644",type:"blob",sha:blob.sha});
  }
  const tree=await github(token,prefix+"/git/trees","POST",{base_tree:commit.tree.sha,tree:files});
  const next=await github(token,prefix+"/git/commits","POST",{message:pos<0?"Add collection item: "+record.car:"Update collection item: "+record.car,tree:tree.sha,parents:[head]});
  try {
    await github(token,prefix+"/git/refs/heads/"+COLLECTION_BRANCH,"PATCH",{sha:next.sha,force:false});
  } catch(err) {
    if(err.status===409 || err.status===422) throw Error("The repository changed during publication. Try again to include the latest changes.");
    throw err;
  }
  return {record,sha:next.sha};
}
function draftStore(mode, action) {
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open("grid64-editor",1);
    req.onupgradeneeded=()=>req.result.createObjectStore("drafts");
    req.onerror=()=>reject(req.error);
    req.onsuccess=()=>{
      const db=req.result;
      const tx=db.transaction("drafts",mode);
      const result=action(tx.objectStore("drafts"));
      tx.oncomplete=()=>{db.close();resolve(result.result);};
      tx.onerror=tx.onabort=()=>{db.close();reject(tx.error);};
    };
  });
}
