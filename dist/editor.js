"use strict";
const editor=$("editor"), form=$("collection-form"), photoInput=form.elements.photo;
const editSelect=$("edit-record"), preview=$("draft-photo"), tokenInput=$("github-token");
const fields=["car","carZh","maker","scale","series","spec","className","year","number","event","team","driver","item","acquired","collectionReason","collectionReasonZh"];
const draftKey=()=>editSelect.value||"new";
let pendingPhoto=null,photoURL="",dirty=false,working=false,photoGeneration=0,loadingPhoto=false,draftId=null,draftRecord=null;
function status(message){$("editor-status").textContent=t(message);}
function showPhoto(blob,path){
  if(photoURL) URL.revokeObjectURL(photoURL);
  photoURL=blob?URL.createObjectURL(blob):"";
  if(photoURL||path)preview.src=photoURL||path;else preview.removeAttribute("src");
  preview.hidden=!(photoURL||path);
}
async function compress(file){
  if(file.size>40*1024*1024)throw Error();
  const url=URL.createObjectURL(file);
  try{
    const image=new Image();image.src=url;await image.decode();
    if(!image.naturalWidth||!image.naturalHeight)throw Error();
    const factor=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(image.naturalWidth*factor));canvas.height=Math.max(1,Math.round(image.naturalHeight*factor));
    const ctx=canvas.getContext("2d",{alpha:false});ctx.fillStyle="#e9e9e5";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",.86));
    if(!blob||!blob.size)throw Error();
    return blob;
  }finally{URL.revokeObjectURL(url);}
}
photoInput.addEventListener("change",async()=>{
  const file=photoInput.files[0];if(!file)return;
  const generation=++photoGeneration; loadingPhoto=true;status("Preparing photo…");
  try{
    const photo=await compress(file);
    if(generation!==photoGeneration)return;
    pendingPhoto=photo;dirty=true;showPhoto(photo);status("");
  }catch{
    if(generation!==photoGeneration)return;
    photoInput.value="";status("This photo could not be opened. Try JPG, PNG or WebP.");
  }finally{if(generation===photoGeneration)loadingPhoto=false;}
});
form.addEventListener("input",e=>{if(fields.includes(e.target.name))dirty=true;});
form.addEventListener("submit",e=>e.preventDefault());
function resetPublish(){tokenInput.value="";$("publish-panel").hidden=true;}
async function populate(key){
  const generation=++photoGeneration; loadingPhoto=false; pendingPhoto=null;
  photoInput.value="";draftId=null;dirty=false;resetPublish();status("");$("published-link").hidden=true;
  const record=publicRecords.get(key)||{};
  const saved=await draftStore("readonly",s=>s.get(key||"new")).catch(()=>null);
  if(generation!==photoGeneration)return;
  if(saved && saved.baseline!==(record.revision||null)) status("The record changed on GitHub. Reload before editing it again.");
  const draft=saved?.baseline===(record.revision||null)?saved:null;
  $("discard-draft").hidden=!draft;
  draftId=draft?.entry.id||record.id||null;
  pendingPhoto=draft?.photo||null;
  fields.forEach(f=>form.elements[f].value=(draft?.entry||record)[f]??(f==="scale"?"1:64":""));
  showPhoto(pendingPhoto,sessionPhotos.get(record.id)||record.photo);
  $("editor-title").dataset.i18n=key?"Edit collection item":"New collection item";
  $("editor-title").textContent=t($("editor-title").dataset.i18n);
}
function setOptions(){
  editSelect.replaceChildren(new Option(t("New item"),""));
  editSelect.options[0].dataset.i18n="New item";
  publicRecords.forEach(x=>editSelect.add(new Option(displayName(x),x.id)));
  $("edit-existing").hidden=!publicRecords.size;
  $("model-brands").replaceChildren(...[...new Set([...RECORDS,...publicRecords.values()].map(x=>x.maker))].map(x=>new Option("",x)));
}
$("open-editor").addEventListener("click",async()=>{
  if(working)return;
  setOptions();await populate("");editor.showModal();form.elements.car.focus();
});
editSelect.addEventListener("change",()=>populate(editSelect.value));
function closeEditor(){
  if(working)return;
  if(dirty&&!confirm(t("You have an unsaved form. Close it without saving?")))return;
  dirty=false;resetPublish();editor.close();
}
$("close-editor").addEventListener("click",closeEditor);
editor.addEventListener("cancel",e=>{e.preventDefault();closeEditor();});
function readEntry(){
  if(loadingPhoto){status("Preparing photo…");return null;}
  if(!form.reportValidity())return null;
  const previous=publicRecords.get(editSelect.value);
  if(!pendingPhoto&&!previous?.photo){status("Choose a photo before saving or publishing.");photoInput.focus();return null;}
  const entry=Object.fromEntries(fields.map(f=>[f,form.elements[f].value.trim()]).filter(([,v])=>v));
  if(["car","maker","series","scale","collectionReason"].some(f=>!entry[f])){status("Complete the required fields.");return null;}
  if(entry.year)entry.year=Number(entry.year);
  entry.id=draftId||(draftId=crypto.randomUUID());
  if(previous?.photo)entry.photo=previous.photo;
  return {entry,photo:pendingPhoto,baseline:previous?.revision||null};
}
$("save-draft").addEventListener("click",async()=>{
  const draft=readEntry();if(!draft)return;
  try{await draftStore("readwrite",s=>s.put(draft,draftKey()));dirty=false;$("discard-draft").hidden=false;status("Draft saved on this device.");}
  catch{status("This browser could not save the draft. You can still publish it.");}
});
$("discard-draft").addEventListener("click",async()=>{
  if(!confirm(t("Discard this local draft?")))return;
  try{await draftStore("readwrite",s=>s.delete(draftKey()));await populate(editSelect.value);}
  catch{status("This browser could not remove the draft.");}
});
$("preview-draft").addEventListener("click",()=>{
  const draft=readEntry();if(!draft)return;
  draftRecord={...draft.entry,status:"draft",photo:photoURL||draft.entry.photo};
  editor.close();openRecord(draftRecord.id,draftRecord);
  dialog.addEventListener("close",()=>{draftRecord=null;editor.showModal();$("preview-draft").focus();},{once:true});
});
$("repo-link").href="https://github.com/"+COLLECTION_REPO;$("repo-link").textContent=COLLECTION_REPO;
$("show-publish").addEventListener("click",()=>{
  if(!readEntry())return;
  if(location.protocol!=="https:" && location.hostname!=="127.0.0.1" && location.hostname!=="localhost"){status("Open the HTTPS website to publish.");return;}
  $("publish-panel").hidden=false;tokenInput.focus();
});
$("cancel-publish").addEventListener("click",()=>{resetPublish();$("show-publish").focus();});
$("confirm-publish").addEventListener("click",async()=>{
  if(working)return;
  const draft=readEntry(),token=tokenInput.value.trim();
  if(!draft)return;
  if(!token){tokenInput.focus();return;}
  const key=draftKey();
  working=true;status("Publishing…");tokenInput.value="";
  [...form.elements].forEach(x=>x.disabled=true);
  try {
    const {record,sha}=await publishRecord(token,draft.entry,draft.photo,draft.baseline);
    publicRecords.set(record.id,record);
    if(draft.photo) {
      const oldURL=sessionPhotos.get(record.id);
      if(oldURL) URL.revokeObjectURL(oldURL);
      sessionPhotos.set(record.id,URL.createObjectURL(draft.photo));
    }
    await draftStore("readwrite",s=>s.delete(key)).catch(()=>{});
    dirty=false;resetPublish();refreshFilters();update();
    $("published-link").href="https://github.com/"+COLLECTION_REPO+"/commit/"+sha;$("published-link").hidden=false;
    status("Saved to GitHub. Pages will publish this revision after its next build.");
    if(draft.photo) {
      const live=new Image();
      live.onload=()=>{if(publicRecords.get(record.id)?.revision!==record.revision)return;const url=sessionPhotos.get(record.id);sessionPhotos.delete(record.id);if(url)URL.revokeObjectURL(url);update();};
      live.src=record.photo;
    }
    setOptions();editSelect.value=record.id;draftId=record.id;pendingPhoto=null;
  }catch(err) {
    status(ZH[err.message]?err.message:"GitHub could not complete this request. Check the token and repository access.");
  }finally{working=false;[...form.elements].forEach(x=>x.disabled=false);}
});
