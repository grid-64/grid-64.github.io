"use strict";
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, x => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[x]);
let sequence = 0;
function diagram(o, hero = false) {
  const id = "car-" + (++sequence), c = o.color, t = o.trim, f = o.kind === "f1";
  const wheels = [91,247].map(x => [87,211].map(y => `<g transform="translate(${x} ${y})"><rect x="-29" y="-17" width="58" height="34" rx="9" fill="#111316" stroke="#555960" stroke-width="1.3"/><rect x="-22" y="-13" width="44" height="26" rx="5" fill="#292c31"/><path d="M-18-9H19M-18 0H19M-18 9H19" stroke="#454850" stroke-width=".9" opacity=".8"/></g>`).join("")).join("");
  const shells = {
    porsche:"M45 148Q44 117 74 101Q98 91 140 97L182 103Q217 99 249 92Q292 87 307 114Q322 152 307 187Q292 211 250 204L184 196L140 201Q85 209 60 188Q46 176 45 148Z",
    honda:"M45 150Q46 116 64 109L128 100L200 103L260 91L309 98L318 113V186L310 204L261 209L201 197L125 199L65 190Q44 178 45 150Z",
    nissan:"M43 151L47 116Q53 105 74 102L136 101L205 100L257 92L299 96L315 109L321 151L313 190L299 204L257 208L205 200L134 201L74 198Q49 194 45 180Z"
  };
  const body = f ? `
  ${wheels}
  <path d="M91 96L126 148L92 203M92 116L116 150L93 183M247 94L224 146L247 206M247 117L232 151L246 184" fill="none" stroke="#6d747f" stroke-width="5"/>
  <path d="M33 95L62 102L71 119L68 181L61 198L33 205Z" fill="url(#${id}-shade)" stroke="#a0a5ab" stroke-width="1.2"/>
  <path d="M43 100L49 201M53 106L59 194" fill="none" stroke="${t}" stroke-width="3" opacity=".9"/>
  <path d="M51 149Q82 143 116 136L135 116Q158 101 190 108L230 125Q248 135 277 136L302 132V168L275 164Q249 164 225 178L191 191Q154 196 134 183L116 163Q78 156 51 153Z" fill="url(#${id}-shade)" stroke="#c2c8d0" stroke-width="1.2"/>
  <path d="M107 148L147 133L156 122L185 117L206 120L221 128L205 134L171 136L154 146Z M107 153L147 167L156 178L185 182L206 179L221 171L205 165L171 163L154 154Z" fill="${t}" opacity=".86"/>
  <path d="M139 150Q149 131 167 132L196 138Q209 150 196 163L167 168Q149 169 139 150Z" fill="#0b0e13" stroke="#78808a"/>
  <path d="M147 150Q157 137 166 139L189 144L195 150L189 156L166 162Q157 163 147 150Z" fill="#262b34"/>
  <ellipse cx="173" cy="150" rx="10" ry="8" fill="#b3b6bf" stroke="#1c2227"/>
  <path d="M264 132L273 145V157L264 168M234 140L250 150L234 160" fill="none" stroke="#7c8390" opacity=".6"/>
  <path d="M291 90H313L320 111V190L312 210H291L299 190V110Z" fill="#171b21" stroke="#89929d"/>
  <path d="M308 98V202M301 103V197" stroke="${t}" stroke-width="2"/>
  <text x="101" y="153" fill="#fff" font-size="8" font-family="monospace" font-weight="bold" text-anchor="middle">${o.number}</text>` : `
  ${wheels}
  <path d="${shells[o.kind]}" fill="url(#${id}-shade)" stroke="#b5bdc6" stroke-width="1.3"/>
  <path d="M70 103Q84 97 108 102L113 119L69 127L52 122ZM70 198Q84 203 108 198L113 181L69 173L52 179Z" fill="#161a22" stroke="#a2a8af" stroke-width=".7"/>
  <path d="M90 108L79 114L60 120M90 193L79 187L60 180" stroke="#e8effe" stroke-width="2.7" fill="none"/>
  <path d="M61 135L111 117L132 120L106 135L77 144L77 156L106 165L132 180L111 184L61 165Z" fill="${t}" opacity=".8"/>
  <path d="M128 119Q150 111 172 114L216 121L243 138V163L215 180L170 186Q145 184 128 181L111 164V135Z" fill="#181e26" stroke="#a3a9b0" stroke-width="1.1"/>
  <path d="M129 123L150 129L151 172L129 177L116 162V137Z" fill="#566778" opacity=".78"/>
  <path d="M154 129L196 125L207 131V170L196 176L154 172Z" fill="url(#${id}-shade)" stroke="#c1c7cd" stroke-width=".7"/>
  <path d="M213 130L238 140V160L213 170Z" fill="#4b5666"/>
  <path d="M118 121L127 114L136 116M118 179L127 186L136 184" fill="none" stroke="${t}" stroke-width="4"/>
  <path d="M247 108L282 102L300 114L295 124L251 128ZM247 192L282 198L300 186L295 176L251 172Z" fill="${t}" opacity=".74"/>
  <path d="M269 100V200M282 97V203" stroke="#1c2026" stroke-width="4"/>
  <path d="M290 85H305V215H290Z" fill="#1c2026" stroke="#9ba4af" stroke-width="1.1"/>
  <path d="M293 90V210" stroke="${t}" stroke-width="2.3"/>
  <rect x="168" y="139" width="23" height="22" fill="#eef0ec"/>
  <text x="179.5" y="154.4" fill="#161719" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">${o.number}</text>`;
  return `<svg viewBox="0 45 350 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(hero ? "Illustrative open-wheel racing car, top view" : "Interpretive top-view illustration for "+o.car)}">
  <defs><linearGradient id="${id}-shade" x1="0" y1="0" x2=".27" y2="1"><stop stop-color="${c}"/><stop offset=".49" stop-color="${c}"/><stop offset="1" stop-color="#18202c"/></linearGradient><filter id="${id}-shadow" x="-25%" y="-50%" width="150%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>
  <path d="M12 150H338M91 61V239M247 61V239" fill="none" stroke="currentColor" opacity=".24" stroke-dasharray="3 5"/>
  <path d="M15 68v-7h7m306 0h7v7m0 164v7h-7m-306 0h-7v-7" fill="none" stroke="currentColor" opacity=".68"/>
  <ellipse cx="174" cy="159" rx="142" ry="63" fill="#030405" opacity=".61" filter="url(#${id}-shadow)"/>
  ${body}
  </svg>`;
}
$("hero-car").innerHTML = diagram({kind:"f1",color:"#4dc7f2",trim:"#bcf0ff",number:"64"},true);
let mode = "all";
let activeTag = null;
let favoritesOnly = false;
const FAVORITES_KEY = "grid64:favorites:v1";
function readFavorites() {
  try {
    const stored=JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return new Set(Array.isArray(stored) ? stored.filter(id=>typeof id==="string") : []);
  } catch {return new Set();}
}
let favorites = readFavorites();
const heartIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 8.8c0 3.4-4.4 6.8-8.8 10.2-4.4-3.4-8.8-6.8-8.8-10.2a4.55 4.55 0 0 1 8.8-1.6 4.55 4.55 0 0 1 8.8 1.6Z"/></svg>';
const tags = {
  series: ["Race series", x => x.series],
  maker: ["Model brand", x => x.maker],
  spec: ["Race category", x => x.spec],
  className: ["Series class", x => x.className],
  team: ["Team", x => x.team],
  driver: ["Driver", x => x.driver],
  event: ["Race / season", x => x.event],
  scale: ["Scale", x => x.scale || "1:64"]
};
const tagHref = (key, value) => "#archive?" + new URLSearchParams({[key]: value}).toString();
const recordHref = id => "#" + new URLSearchParams({record:id}).toString();
const routeRecordId = () => location.hash.startsWith("#record=") ? new URLSearchParams(location.hash.slice(1)).get("record") : null;
const readTag = () => {
  if (!location.hash.startsWith("#archive?")) return null;
  const pair = [...new URLSearchParams(location.hash.slice(9))][0];
  return pair && Object.hasOwn(tags, pair[0]) && pair[1] ? pair : null;
};
const matchesMode = (x, m) => m === "all" || (m === "f1" && x.series === "Formula 1") || (m === "gt3" && x.spec === "GT3") || (m === "sgt" && x.series === "Super GT");
const isCollected = x => x.status === "collected";
const objectImage = (x, preview = false) => x.photo
  ? `<img class="object-photo" src="${esc(sessionPhotos.get(x.id) || (preview && x.thumbnail ? x.thumbnail : x.photo))}" alt="${esc(localized(x,"photoAlt") || displayName(x))}" ${preview ? 'loading="lazy"' : ""}>`
  : diagram(x);
function displayName(x) {return LANG==="zh" && x.carZh ? x.carZh : x.car;}
function localized(x, field) {return LANG==="zh" && x[field+"Zh"] ? x[field+"Zh"] : x[field];}
function tagLabel(key,value) {
  if (LANG==="zh" && (key==="team" || key==="driver")) {
    const translation=archiveRecords().find(x=>x[key]===value && x[key+"Zh"]);
    if (translation) return translation[key+"Zh"];
  }
  return t(value);
}
function raceNumber(x) {return x.number ? "#"+x.number : "";}
function catalogNumber(x) {return x.catalogId || (x.id.startsWith("064-") ? x.id : x.id.slice(0,8).toUpperCase());}
function favoriteButton(x, detail=false) {
  const saved=favorites.has(x.id);
  return `<button type="button" class="favorite-button${detail?" favorite-detail":""}" data-favorite="${esc(x.id)}" aria-label="${esc(t("Favorite")+": "+displayName(x))}" aria-pressed="${saved}" title="${t(saved?"Remove from favorites":"Add to favorites")}">${heartIcon}${detail?'<span>'+t(saved?"Saved to favorites":"Add to favorites")+'</span>':""}</button>`;
}
function syncFavorites() {
  document.querySelectorAll("[data-favorite]").forEach(button=>{
    const saved=favorites.has(button.dataset.favorite);
    button.setAttribute("aria-pressed",String(saved));
    button.title=t(saved?"Remove from favorites":"Add to favorites");
    if(button.classList.contains("favorite-detail")) button.querySelector("span").textContent=t(saved?"Saved to favorites":"Add to favorites");
  });
}
function toggleFavorite(id, button) {
  if(favorites.has(id)) favorites.delete(id); else favorites.add(id);
  try {localStorage.setItem(FAVORITES_KEY,JSON.stringify([...favorites]));} catch {}
  if(favoritesOnly) {
    update();
    if(!button?.classList.contains("favorite-detail")) {
      const next=$("cards").querySelector("[data-favorite]");
      (next || $("favorites-only")).focus({preventScroll:true});
    }
  }
  syncFavorites();
}
function card(x) {
  const caption=x.photo ? "MODEL PHOTOGRAPH" : "PLAN VIEW / ILLUSTRATION";
  const meta=[t(x.series),x.spec===x.series?"":t(x.spec),x.year].filter(Boolean).map(esc).join(" · ");
  const secondary=[localized(x,"team") || x.maker,raceNumber(x)].filter(Boolean).map(esc).join(" / ");
  return `<article class="card">
  <button type="button" data-record="${esc(x.id)}" aria-label="${esc(t("Open")+" "+displayName(x)+(x.number?", "+t("number")+" "+x.number:""))}">
    <div class="card-art${x.photo ? " has-photo" : ""}"><div class="card-meta"><span>${esc(catalogNumber(x))}</span><span>${esc(x.scale || "1:64")}</span></div><span class="ghost" aria-hidden="true">${esc(x.number)}</span>${objectImage(x, true)}<span class="card-figure">${t(caption)}</span></div>
    <div class="card-info"><div><p>${meta}</p><h3>${esc(displayName(x))}</h3><p class="team">${secondary}</p></div><span class="arrow" aria-hidden="true">↗</span></div>
  </button>${favoriteButton(x)}</article>`;
}
function renderGroups(list, field) {
  if (!list.length) return "";
  const grid = items => `<div class="cards">${items.map(card).join("")}</div>`;
  if (!field) return grid(list);
  const groups = new Map();
  for (const record of list) {
    const name = record[field]?.trim() || "Unclassified";
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(record);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([name, items], index) =>
    `<section class="record-group" aria-labelledby="group-heading-${index}">
      <div class="group-heading"><h3 id="group-heading-${index}">${esc(t(name))}</h3><span>${items.length} ${t(items.length === 1 ? "record" : "records")}</span></div>
      ${grid(items)}
    </section>`).join("");
}
function update() {
  const records=archiveRecords();
  $("crosslink").hidden=!records.some(x=>x.series==="Super GT"&&x.spec==="GT3");
  const q = $("query").value.toLowerCase().trim().split(/\s+/).filter(Boolean), series = $("series").value, spec = $("spec").value;
  const list = records.filter(x => (!favoritesOnly || favorites.has(x.id)) && (!activeTag || tags[activeTag[0]][1](x) === activeTag[1]) && matchesMode(x,mode) && (!series || x.series === series) && (!spec || x.spec === spec || x.className === spec) && q.every(word => [x.car,x.carZh,x.team,x.teamZh,x.id,x.catalogId,x.item,x.maker,x.driver,x.driverZh,x.event,x.number,"#"+Number(x.number),x.series,x.year,x.spec,x.className,t(x.series)].join(" ").toLowerCase().includes(word)));
  if ($("order").value === "year") list.sort((a,b) => b.year-a.year || a.id.localeCompare(b.id));
  $("cards").innerHTML = renderGroups(list, $("group").value);
  $("empty").hidden = list.length !== 0;
  $("empty-message").textContent=t(favoritesOnly?"No favorites in this view. Select the heart on a car to save it.":"No records match those filters.");
  $("favorites-only").setAttribute("aria-pressed",String(favoritesOnly));
  $("result-count").textContent = `${String(list.length).padStart(2,"0")} / ${String(records.length).padStart(2,"0")} ${t("RECORDS")}`;
  $("active-tag").hidden = !activeTag;
  $("active-tag-name").textContent = activeTag ? `${t(tags[activeTag[0]][0])}: ${tagLabel(...activeTag)}` : "";
  $("record-status").textContent = list.length === 0 ? "" : list.every(isCollected) ? t("PERSONAL COLLECTION") : list.some(isCollected) ? t("COLLECTION & REFERENCE RECORDS") : t("REFERENCE RECORDS / OWNERSHIP UNCONFIRMED");
  document.querySelectorAll("[data-mode]").forEach(b => {b.hidden=b.dataset.mode!=="all"&&!records.some(x=>matchesMode(x,b.dataset.mode));b.setAttribute("aria-pressed",String(b.dataset.mode===mode));});
}
function reset() {mode="all"; $("query").value=""; $("series").value=""; $("spec").value=""; $("order").value="index";}
document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => {mode=b.dataset.mode; $("series").value=""; $("spec").value=""; update();}));
$("query").addEventListener("input", update);
$("favorites-only").addEventListener("click",()=>{favoritesOnly=!favoritesOnly;update();});
window.addEventListener("storage",event=>{if(event.key===FAVORITES_KEY || event.key===null){favorites=readFavorites();if(favoritesOnly)update();syncFavorites();}});
["group","series","spec","order"].forEach(k => $(k).addEventListener("change", update));
function clearTag() {
  if (activeTag) history.replaceState(null, "", "#archive");
  activeTag = null;
}
$("clear").addEventListener("click", () => {favoritesOnly=false;clearTag(); reset(); update(); $("query").focus();});
$("crosslink").addEventListener("click", () => {clearTag(); reset(); $("series").value="Super GT"; $("spec").value="GT3"; update(); $("archive").scrollIntoView({behavior:"instant"}); $("series").focus({preventScroll:true});});
function refreshFilters() {
  const rows=archiveRecords();
  for(const [id,empty,values] of [["series","Any series",rows.map(x=>x.series)],["spec","Any class / spec",rows.flatMap(x=>[x.spec,x.className])]]) {
    const select=$(id), saved=select.value;
    select.replaceChildren(new Option(t(empty),""));
    for(const value of [...new Set(values.filter(Boolean))].sort()) select.add(new Option(t(value),value));
    select.value=[...select.options].some(x=>x.value===saved)?saved:"";
  }
}
function driverFlag(code) {
  if(typeof code!=="string" || !/^[A-Z]{2}$/i.test(code)) return "";
  const iso=code.toUpperCase();
  let country=iso;
  try {country=new Intl.DisplayNames([LANG==="zh"?"zh-Hans":"en"],{type:"region"}).of(iso) || iso;} catch {}
  const emoji=String.fromCodePoint(...Array.from(iso,letter=>0x1f1e6+letter.charCodeAt(0)-65));
  return `<span class="driver-flag" title="${esc(country)}" aria-hidden="true">${emoji}</span>`;
}
function rows(items, links = true) {
  return items.filter(([,v])=>v).map(([label,value,key,code,display]) => {
    const flag=driverFlag(code);
    const shown=display || (key ? t(value) : value);
    const content = key && links
      ? `<a class="object-tag" href="${esc(tagHref(key,value))}" aria-label="${esc(t("Browse by")+" "+t(label)+": "+shown)}">${flag}${esc(shown)} <span aria-hidden="true">↗</span></a>`
      : flag+esc(shown);
    return `<div><dt>${t(label)}</dt><dd>${content}</dd></div>`;
  }).join("");
}
function collectorNote(x) {
  const reason = (LANG==="zh" && x.collectionReasonZh || x.collectionReason)?.trim();
  return `<section class="collector-note" aria-label="${t("Collector’s note")}">
    <h3>${t("Why I collected it")}</h3>
    <p${reason ? "" : ' class="note-pending"'}>${reason ? esc(reason) : t("Personal note not yet recorded.")}</p>
    <dl>${rows([["Acquired", x.acquired || t("Not yet recorded")]])}</dl>
  </section>`;
}
const dialog = $("record");
let currentRecord=null;
let currentPhotos=[];
let showingRecordRoute=false;
function galleryPhotoLabel(index) {return LANG==="zh"?"查看照片 "+(index+1):"View photo "+(index+1);}
function gallery(x) {
  const primary=sessionPhotos.get(x.id) || x.photo;
  const other=Array.isArray(x.photos)?x.photos.filter(photoPath):[];
  currentPhotos=primary?[primary,...new Set(other.filter(path=>path!==x.photo && path!==primary))]:[];
  if(currentPhotos.length<2) return `${objectImage(x)}<p>${t(x.photo?"MODEL PHOTOGRAPH":"INTERPRETIVE PLAN VIEW")}</p>`;
  return `<div class="gallery-main"><img class="object-photo" src="${esc(primary)}" alt="${esc(localized(x,"photoAlt") || displayName(x))}"></div>
    <p class="gallery-caption">${t("MODEL PHOTOGRAPH")} / <span id="gallery-count">1 / ${currentPhotos.length}</span></p>
    <div class="gallery-thumbs" role="group" aria-label="${t("Model photos")}">
    ${currentPhotos.map((path,index)=>`<button type="button" data-photo-index="${index}" aria-label="${galleryPhotoLabel(index)}" aria-pressed="${index===0}"><img src="${esc(path)}" alt="" loading="lazy"></button>`).join("")}
    </div>`;
}
function selectGalleryPhoto(index) {
  const path=currentPhotos[index], main=$("record-content").querySelector(".gallery-main img");
  if(!path || !main) return;
  main.src=path;
  main.alt=displayName(currentRecord)+" — "+galleryPhotoLabel(index);
  $("gallery-count").textContent=(index+1)+" / "+currentPhotos.length;
  $("record-content").querySelectorAll("[data-photo-index]").forEach(button=>button.setAttribute("aria-pressed",String(Number(button.dataset.photoIndex)===index)));
}
function referenceImagePath(path) {
  return typeof path==="string" && /^collection\/photos\/[a-z0-9][a-z0-9-]*\.(?:jpe?g|webp|png)$/i.test(path);
}
function officialUrl(value) {
  if(typeof value!=="string") return "";
  try {
    const url=new URL(value);
    return url.protocol==="https:" && !url.username && !url.password ? url.href : "";
  } catch {return "";}
}
function referenceSection(x) {
  const images=Array.isArray(x.referencePhotos)?x.referencePhotos.filter(image=>image && referenceImagePath(image.src)):[];
  const sources=(Array.isArray(x.officialSources)?x.officialSources:[]).flatMap(source=>{
    const url=officialUrl(source?.url);
    return url ? [{url,label:localized(source,"label")||t("Official source")}] : [];
  });
  const summary=localized(x,"seasonSummary");
  if(!images.length && !sources.length && !summary) return "";
  const gallery=images.map((image,index)=>{
    const caption=localized(image,"caption");
    const alt=localized(image,"alt") || caption || displayName(x)+" — "+t("Full-size car photograph");
    const url=officialUrl(image.source), credit=localized(image,"credit");
    const source=url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(credit || t("Image source"))} ↗</a>`:credit?`<span>${esc(credit)}</span>`:"";
    return `<figure class="reference-figure">
      <a class="reference-image" href="${esc(image.src)}" target="_blank" rel="noopener noreferrer"><img src="${esc(image.src)}" alt="${esc(alt)}" loading="lazy" decoding="async"></a>
      <figcaption><span class="reference-number">${String(index+1).padStart(2,"0")}</span><div>${caption?`<p>${esc(caption)}</p>`:""}${source?`<p class="reference-credit">${source}</p>`:""}</div></figcaption>
    </figure>`;
  }).join("");
  return `<section class="race-reference" aria-labelledby="race-reference-title">
    <p class="eyebrow">${t("RACE CONTEXT")}</p>
    <h3 id="race-reference-title">${t("Full-size car reference")}</h3>
    ${summary?`<p class="season-summary">${esc(summary)}</p>`:""}
    ${gallery?`<div class="reference-strip">${gallery}</div>`:""}
    ${sources.length?`<div class="race-sources"><h4>${t("Official sources")}</h4><ul>${sources.map(source=>`<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} ↗</a></li>`).join("")}</ul></div>`:""}
  </section>`;
}
function openRecord(id, previewRecord=null) {
  const x=previewRecord||archiveRecords().find(r=>r.id===id);
  if (!x) return;
  currentRecord=x;
  const related=archiveRecords().find(r=>r.id===x.link);
  const links=x.status!=="draft";
  $("record-id").textContent=t("OBJECT")+" "+catalogNumber(x)+" / "+t(x.status==="draft"?"DRAFT PREVIEW":isCollected(x)?"PERSONAL COLLECTION":"REFERENCE RECORD");
  const details = `<div class="metadata">
    <section><h3>${t("Full-size car")}</h3><dl>${rows([["Race series",x.series,"series"],["Team",x.team,"team",null,localized(x,"team")],["Driver",x.driver,"driver",x.driverCountry,localized(x,"driver")],["Race / season",x.event,"event"],["Specification",x.spec,"spec"],["Series class",x.className,"className"]],links)}</dl></section>
    <section><h3>${t("Miniature")}</h3><dl>${rows([["Scale",x.scale || "1:64","scale"],["Model brand",x.maker,"maker"],["Catalogue code",x.item]],links)}</dl>${x.source ? `<a href="${esc(x.source)}">${t("Maker’s reference")} ↗</a>` : ""}</section>
  </div>`;
  const extra = `${x.look ? `<p class="eyebrow">${t("LOOK CLOSER")}</p><p>${esc(x.look)}</p>` : ""}${related ? `<button type="button" class="text-btn" data-related="${related.id}">${t("Compare with")} ${esc(displayName(related))} ↗</button>` : ""}${isCollected(x) || x.status==="draft" ? "" : `<p class="disclosure">${t("Catalogue example. Ownership is unconfirmed; the illustration is not an object photograph.")}</p>`}`;
  $("record-content").innerHTML=`<div class="detail-grid">
    <div class="detail-plate${x.photo ? " has-photo" : ""}">${gallery(x)}</div>
    <div class="detail-main"><p class="eyebrow">${[t(x.series),x.year,raceNumber(x)].filter(Boolean).map(esc).join(" / ")}</p><h2 id="record-title">${esc(displayName(x))}</h2>${links?`<div class="record-actions">${favoriteButton(x,true)} <a class="record-permalink" href="${esc(recordHref(x.id))}">${t("Record link")} ↗</a></div>`:""}${collectorNote(x)}${details}</div>
  </div>${referenceSection(x)}${extra ? `<div class="detail-note">${extra}</div>` : ""}`;
  if (!dialog.open) dialog.showModal(); else dialog.scrollTop = 0;
  $("close-record").focus();
}
$("cards").addEventListener("click", e => {
  const favorite=e.target.closest("[data-favorite]");
  if(favorite) {toggleFavorite(favorite.dataset.favorite,favorite);return;}
  const b=e.target.closest("[data-record]"); if(b) openRecord(b.dataset.record);
});
function followRecordRoute() {
  const id=routeRecordId();
  if(!id) {
    if(showingRecordRoute && dialog.open) dialog.close();
    showingRecordRoute=false;
    return false;
  }
  showingRecordRoute=true;
  if(!dialog.open || currentRecord?.id!==id) openRecord(id);
  return true;
}
function followTag() {
  const previous = activeTag;
  activeTag = readTag();
  if (activeTag) {
    if (dialog.open) dialog.close();
    reset();
    update();
    $("archive").scrollIntoView({behavior:"instant"});
    $("archive-title").focus({preventScroll:true});
  } else if (previous) {
    update();
    if (location.hash === "#archive") $("archive-title").focus({preventScroll:true});
  }
}
$("record-content").addEventListener("click", e => {
  const favorite=e.target.closest("[data-favorite]");
  if(favorite) {toggleFavorite(favorite.dataset.favorite,favorite);return;}
  const photo=e.target.closest("[data-photo-index]");
  if(photo) {selectGalleryPhoto(Number(photo.dataset.photoIndex));return;}
  const b=e.target.closest("[data-related]");
  if(b) openRecord(b.dataset.related);
  const tag=e.target.closest(".object-tag");
  if(tag && tag.hash === location.hash && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    followTag();
  }
});
$("close-record").addEventListener("click", ()=>dialog.close());
dialog.addEventListener("close",()=>{
  showingRecordRoute=false;
  if(routeRecordId()) {
    history.replaceState(null,"",activeTag?tagHref(...activeTag):"#archive");
    $("archive").scrollIntoView({behavior:"instant"});
    $("archive-title").focus({preventScroll:true});
  }
});
dialog.addEventListener("click", e => {if(e.target===dialog && !e.target.closest("#record-content")) {const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom) dialog.close();}});
window.addEventListener("hashchange",()=>{if(!followRecordRoute()) followTag();});
function switchLanguage() {
  LANG=LANG==="en"?"zh":"en";
  translatePage();refreshFilters();update();
  if(dialog.open && currentRecord) {
    const position=dialog.scrollTop;
    const photo=dialog.querySelector('[data-photo-index][aria-pressed="true"]');
    openRecord(currentRecord.id,currentRecord);
    if (photo && Number(photo.dataset.photoIndex)>0) selectGalleryPhoto(Number(photo.dataset.photoIndex));
    dialog.scrollTop=position;
    $("record-language").focus({preventScroll:true});
  }
}
$("language").addEventListener("click",switchLanguage);
$("record-language").addEventListener("click",switchLanguage);
translatePage();refreshFilters();
if (readTag()) followTag(); else {update();followRecordRoute();}
loadPublicCollection().then(()=>{refreshFilters();update();followRecordRoute();}).catch(()=>{});

