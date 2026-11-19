"use strict";(()=>{var C={open:!1,pinned:!1,side:"right",width:320,handleY:40,theme:"auto"},D=new Set(["about","account","apps","codespaces","collections","dashboard","enterprises","events","explore","features","gist","issues","login","logout","marketplace","new","notifications","organizations","orgs","pricing","pulls","search","security","sessions","settings","signup","sponsors","stars","team","topics","trending","users"]),B=/^[A-Za-z0-9_.-]+$/;function M(n){let e;try{e=new URL(n)}catch{return null}if(e.protocol!=="https:"||e.username||e.password||e.port)return null;let t=e.pathname.split("/").filter(Boolean),r=t[0],o=t[1];if(!r||!o||!B.test(r)||!B.test(o)||D.has(r.toLowerCase())||o==="."||o==="..")return null;let a=e.origin.toLowerCase();return{id:`${a}/${r.toLowerCase()}/${o.toLowerCase()}`,origin:a,owner:r,name:o,url:`${a}/${r}/${o}`}}function P(n,e){let t=n.querySelector('meta[name="octolytics-dimension-repository_nwo"]')?.content;return t?t.trim().toLocaleLowerCase()===`${e.owner}/${e.name}`.toLocaleLowerCase():n.querySelector('meta[name="octolytics-dimension-repository_id"], #repository-container-header, [data-testid="repository-container-header"], [data-testid="repo-header-actions"]')?n.querySelector('[data-testid="repo-header-actions"], #repository-container-header')?!0:Array.from(n.querySelectorAll("header h1, .repohead h1, .pagehead h1, #repository-container-header h1")).some(o=>o.textContent?.toLocaleLowerCase().includes(e.name.toLocaleLowerCase())):!1}function R(n,e){let t=e.trim().toLocaleLowerCase();return t?n.filter(r=>`${r.owner} ${r.name} ${r.label??""} ${new URL(r.origin).hostname}`.toLocaleLowerCase().includes(t)):n}function N(n){let e=n&&typeof n=="object"?n:{};return{open:typeof e.open=="boolean"?e.open:C.open,pinned:typeof e.pinned=="boolean"?e.pinned:C.pinned,side:e.side==="left"?"left":"right",width:typeof e.width=="number"&&Number.isFinite(e.width)?Math.max(260,Math.min(520,Math.round(e.width))):C.width,handleY:typeof e.handleY=="number"&&Number.isFinite(e.handleY)?Math.max(0,Math.min(100,e.handleY)):C.handleY,theme:e.theme==="dark"||e.theme==="light"?e.theme:"auto"}}function $(n){if(!Array.isArray(n))return[];let e=new Set,t=[];for(let r of n){if(!r||typeof r!="object"||typeof r.url!="string")continue;let o=M(r.url);!o||e.has(o.id)||typeof r.addedAt!="number"||(e.add(o.id),t.push({...o,addedAt:r.addedAt,...typeof r.label=="string"&&r.label.trim()?{label:r.label.trim().slice(0,100)}:{},...typeof r.folderId=="string"?{folderId:r.folderId}:{}}))}return t}function H(n){if(!Array.isArray(n))return[];let e=new Set;return n.filter(t=>!t||typeof t.id!="string"||typeof t.name!="string"||!t.id||!t.name.trim()||e.has(t.id)?!1:(e.add(t.id),!0)).map(({id:t,name:r})=>({id:t,name:r.trim().slice(0,100)}))}async function T(){let n=await chrome.storage.local.get(["bookmarks","settings","hosts","folders"]);return{bookmarks:$(n.bookmarks),folders:H(n.folders),settings:N(n.settings),hosts:Array.isArray(n.hosts)?n.hosts.filter(e=>typeof e=="string"):[]}}var Z=Promise.resolve();async function b(n){let e=await chrome.runtime.sendMessage(n);if(!e?.ok)throw new Error(e?.error??"Extension unavailable");return e.data}var z={bookmark:"M5 3.5A1.5 1.5 0 0 1 6.5 2h5A1.5 1.5 0 0 1 13 3.5V15l-4-2.8L5 15V3.5Z",close:"M4 4l8 8m0-8-8 8",search:"M11.5 11.5 15 15M13 7.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z",pin:"M5 2h6l-1 4 2 2v1H4V8l2-2-1-4ZM8 9v5",chevron:"m5 3 5 5-5 5",settings:"M2 4h7m3 0h2M2 12h2m3 0h7M9 4a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0ZM4 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0Z",sun:"M7.5 1v2m0 9v2M1 7.5h2m9 0h2M3 3l1.5 1.5m6 6L12 12M12 3l-1.5 1.5m-6 6L3 12M10 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z",edit:"M11 2.5 13.5 5 5.5 13H3v-2.5L11 2.5Z",trash:"M3 4h9m-7-2h5m1 2-.5 10h-6L4 4m2 2v6m3-6v6",up:"m3 10 4.5-5L12 10",down:"m3 5 4.5 5L12 5",grip:"M5 4h.01M10 4h.01M5 8h.01M10 8h.01M5 12h.01M10 12h.01",plus:"M8 2v12M2 8h12",arrow:"M3 8h10m-4-4 4 4-4 4"};function E(n,e=16){let t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("viewBox","0 0 16 16"),t.setAttribute("width",String(e)),t.setAttribute("height",String(e)),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","1.6"),t.setAttribute("stroke-linecap","round"),t.setAttribute("stroke-linejoin","round"),t.setAttribute("aria-hidden","true");let r=document.createElementNS("http://www.w3.org/2000/svg","path");return r.setAttribute("d",z[n]??z.bookmark??""),t.append(r),t}function v(n,e,t="icon-button"){let r=document.createElement("button");return r.type="button",r.className=t,r.setAttribute("aria-label",n),r.title=n,r.append(E(e)),r}var I=`:host {
  --bg: var(--bgColor-default, #ffffff);
  --subtle: var(--bgColor-muted, #f6f8fa);
  --text: var(--fgColor-default, #1f2328);
  --muted: var(--fgColor-muted, #59636e);
  --line: var(--borderColor-default, #d1d9e0);
  --accent: var(--fgColor-accent, #0969da);
  --hover: var(--bgColor-neutral-muted, #eaeef2);
  --focus: #0969da;
  all: initial;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--text);
  color-scheme: light;
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  pointer-events: none;
  line-height: 1.4;
}
:host([data-theme="dark"]) {
  --bg: var(--bgColor-default, #0d1117);
  --subtle: var(--bgColor-muted, #151b23);
  --text: var(--fgColor-default, #f0f6fc);
  --muted: var(--fgColor-muted, #9198a1);
  --line: var(--borderColor-default, #3d444d);
  --accent: var(--fgColor-accent, #4493f8);
  --hover: var(--bgColor-neutral-muted, #22272e);
  --focus: #4493f8;
  color-scheme: dark;
}
:host *,
:host *::before,
:host *::after {
  box-sizing: border-box;
}
button,
input {
  font: inherit;
}
button {
  cursor: pointer;
}
button:focus-visible,
input:focus-visible,
a:focus-visible,
[role="separator"]:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
.panel {
  position: absolute;
  inset-block: 0;
  right: 0;
  width: min(var(--panel-width), 92vw);
  display: flex;
  flex-direction: column;
  background: var(--bg);
  border-inline-start: 1px solid var(--line);
  box-shadow: -8px 0 30px #0002;
  pointer-events: auto;
  transform: translateX(100%);
  transition: transform 0.22s ease;
  overflow: hidden;
}
:host([data-open="true"]) .panel {
  transform: translateX(0);
}
:host([data-side="left"]) .panel {
  right: auto;
  left: 0;
  border-inline-start: 0;
  border-inline-end: 1px solid var(--line);
  box-shadow: 8px 0 30px #0002;
  transform: translateX(-100%);
}
:host([data-side="left"][data-open="true"]) .panel {
  transform: translateX(0);
}
.edge-handle {
  position: absolute;
  top: calc((100% - 72px) * var(--handle-ratio, 0.4));
  right: 0;
  width: 32px;
  height: 72px;
  border: 1px solid var(--line);
  border-radius: 8px 0 0 8px;
  background: var(--bg);
  color: var(--accent);
  box-shadow: 0 2px 12px #0002;
  pointer-events: auto;
  transition: transform 0.2s;
  display: grid;
  place-items: center;
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.edge-handle:active {
  cursor: grabbing;
}
.edge-handle:hover {
  transform: translateX(-3px);
}
:host([data-side="left"]) .edge-handle {
  right: auto;
  left: 0;
  border-radius: 0 8px 8px 0;
}
:host([data-side="left"]) .edge-handle:hover {
  transform: translateX(3px);
}
:host([data-open="true"]) .edge-handle {
  display: none;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 18px 16px;
  gap: 10px;
  border-bottom: 1px solid var(--line);
}
.brand {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 11px;
}
.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: var(--accent);
  background: var(--subtle);
  border: 1px solid var(--line);
}
.brand-text {
  display: grid;
  gap: 1px;
}
.eyebrow {
  font-size: 9px;
  letter-spacing: 0.13em;
  font-weight: 700;
  color: var(--muted);
}
.brand-text strong {
  font-size: 17px;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.header-actions,
.row-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}
.icon-button {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 6px;
  display: grid;
  place-items: center;
  color: var(--muted);
  background: transparent;
}
.icon-button:hover {
  background: var(--hover);
  color: var(--text);
}
.icon-button[aria-pressed="true"] {
  color: var(--accent);
  background: var(--subtle);
}
.search {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 17px 18px 13px;
  padding: 0 12px;
  height: 38px;
  color: var(--muted);
  background: var(--subtle);
  border: 1px solid var(--line);
  border-radius: 8px;
}
.search:focus-within {
  border-color: var(--focus);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--focus) 20%, transparent);
}
.search input {
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  width: 100%;
  min-width: 0;
  font-size: 13px;
}
.search input::placeholder {
  color: var(--muted);
  opacity: 1;
}
.search input::-webkit-search-cancel-button {
  cursor: pointer;
}
.favorites {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 19px 9px;
}
.section-header h2 {
  margin: 0;
  color: var(--muted);
  font-size: 10px;
  letter-spacing: 0.12em;
  font-weight: 700;
}
.count {
  min-width: 20px;
  padding: 1px 5px;
  border-radius: 10px;
  text-align: center;
  background: var(--subtle);
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
}
.bookmark-list {
  margin: 0;
  padding: 0 9px 18px;
  list-style: none;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
}
.bookmark-row {
  display: flex;
  align-items: center;
  min-height: 57px;
  margin-bottom: 3px;
  padding: 5px 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  gap: 5px;
  transition:
    background-color 0.15s,
    border-color 0.15s;
}
.bookmark-row:hover {
  background: var(--subtle);
}
.bookmark-row[data-active="true"] {
  background: var(--subtle);
  border-color: var(--line);
}
.bookmark-row.drop-target {
  border-color: var(--accent);
}
.bookmark-row.dragging {
  opacity: 0.45;
}
.grip {
  color: var(--muted);
  opacity: 0.55;
  width: 16px;
  flex: none;
  cursor: grab;
}
.repo-link {
  display: grid;
  gap: 2px;
  flex: 1;
  min-width: 0;
  padding: 4px 0;
  text-decoration: none;
  color: var(--text);
}
.repo-link:hover strong {
  color: var(--accent);
}
.repo-link strong {
  font-size: 12px;
  font-weight: 650;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.repo-link small {
  color: var(--muted);
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-actions {
  opacity: 0;
}
.bookmark-row:hover .row-actions,
.bookmark-row:focus-within .row-actions {
  opacity: 1;
}
.row-actions .icon-button {
  width: 22px;
  height: 26px;
}
.row-actions .icon-button svg {
  width: 13px;
  height: 13px;
}
.folder {
  margin-bottom: 3px;
  list-style: none;
}
.folder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 2px 4px 2px 8px;
  border-radius: 8px;
}
.folder-header:hover {
  background: var(--subtle);
}
.icon-button.folder-toggle {
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 6px;
  border: 0;
  background: transparent;
  color: var(--text);
  font-size: 12px;
  font-weight: 650;
  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 6px 0;
}
.folder-toggle svg {
  flex: none;
  transition: transform 0.15s;
}
.folder-toggle[aria-expanded="true"] svg {
  transform: rotate(90deg);
}
.folder-items {
  margin: 0;
  padding: 0 0 0 14px;
  list-style: none;
}
.folder.drop-target > .folder-header {
  outline: 1px solid var(--accent);
}
.row-actions select {
  max-width: 84px;
  height: 22px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg);
  color: var(--muted);
  font-size: 10px;
}
.empty {
  margin: 28px 18px;
  color: var(--muted);
  text-align: center;
  font-size: 12px;
  line-height: 1.6;
}
[hidden] {
  display: none !important;
}
footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 18px 17px;
  border-top: 1px solid var(--line);
}
.add-current {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 1;
  min-height: 34px;
  padding: 5px 9px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--subtle);
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
}
.add-current:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.resize {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 6px;
  cursor: ew-resize;
  touch-action: none;
}
:host([data-side="left"]) .resize {
  left: auto;
  right: 0;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
@media (max-width: 600px) {
  .panel {
    width: min(var(--panel-width), 100vw);
  }
}
@media (prefers-reduced-motion: reduce) {
  .panel,
  .edge-handle,
  .bookmark-row {
    transition: none;
  }
}
@media (forced-colors: active) {
  .bookmark-row[data-active="true"] {
    outline: 1px solid Highlight;
  }
}
`;var A=class{host;root;panel;handle;list;search;count;addCurrent;pin;status;settings;bookmarks=[];folders=[];collapsed=new Set;current=null;themeObserver;colorScheme=matchMedia("(prefers-color-scheme: dark)");resizeCleanup=null;oldPadding={left:"",right:""};constructor(e){this.settings=e.settings,this.bookmarks=e.bookmarks,this.folders=e.folders,this.host=document.createElement("gh-bookmarks"),this.root=this.host.attachShadow({mode:"closed"});let t=document.createElement("style");t.textContent=I,this.root.append(t),this.handle=v("Open bookmarks","bookmark","edge-handle"),this.handle.addEventListener("click",()=>{this.setSettings({open:!0},!0)}),this.handle.addEventListener("pointerdown",x=>this.startHandleDrag(x)),this.root.append(this.handle),this.panel=document.createElement("aside"),this.panel.className="panel",this.panel.setAttribute("aria-label","Repository bookmarks"),this.panel.id="bookmarks-panel",this.root.append(this.panel);let r=document.createElement("header");r.className="panel-header";let o=document.createElement("div");o.className="brand";let a=document.createElement("span");a.className="brand-mark",a.append(E("bookmark",18));let i=document.createElement("div");i.className="brand-text";let s=document.createElement("span");s.className="eyebrow",s.textContent="YOUR WORKSPACE";let c=document.createElement("strong");c.textContent="Bookmarks",i.append(s,c),o.append(a,i);let f=document.createElement("div");f.className="header-actions",this.pin=v("Pin sidebar","pin"),this.pin.addEventListener("click",()=>{this.setSettings({pinned:!this.settings.pinned})});let k=v("Move sidebar to left","arrow");k.classList.add("side-toggle"),k.addEventListener("click",()=>{this.setSettings({side:this.settings.side==="left"?"right":"left"})});let u=v("Close sidebar","close");u.addEventListener("click",()=>{this.setSettings({open:!1},!0)}),f.append(this.pin,k,u),r.append(o,f),this.panel.append(r);let l=document.createElement("label");l.className="search",l.append(E("search")),this.search=document.createElement("input"),this.search.type="search",this.search.placeholder="Find a repository\u2026",this.search.setAttribute("aria-label","Search bookmarks"),this.search.addEventListener("input",()=>this.filter()),l.append(this.search),this.panel.append(l);let p=document.createElement("section");p.className="favorites";let w=document.createElement("div");w.className="section-header";let L=document.createElement("h2");L.textContent="SAVED REPOSITORIES",this.count=document.createElement("span"),this.count.className="count",w.append(L,this.count);let S=v("Create folder","plus");S.addEventListener("click",()=>{this.createFolder()}),w.append(S),this.list=document.createElement("ul"),this.list.className="bookmark-list",p.append(w,this.list),this.panel.append(p);let d=document.createElement("footer");this.addCurrent=document.createElement("button"),this.addCurrent.type="button",this.addCurrent.className="add-current",this.addCurrent.append(E("plus"),document.createTextNode("Add current repository")),this.addCurrent.addEventListener("click",()=>{this.toggleCurrent()});let h=v("Manage Enterprise hosts","settings");h.addEventListener("click",()=>{chrome.runtime.openOptionsPage()});let m=v("Change theme","sun");m.addEventListener("click",()=>{this.setSettings({theme:this.host.dataset.theme==="dark"?"light":"dark"})}),m.dataset.action="theme",d.append(this.addCurrent,m,h),this.panel.append(d);let g=document.createElement("div");g.className="resize",g.setAttribute("role","separator"),g.setAttribute("aria-label","Resize bookmarks sidebar"),g.setAttribute("aria-orientation","vertical"),g.setAttribute("aria-valuemin","260"),g.setAttribute("aria-valuemax","520"),g.tabIndex=0,g.addEventListener("pointerdown",x=>this.startResize(x,g)),g.addEventListener("keydown",x=>{if(x.key!=="ArrowLeft"&&x.key!=="ArrowRight")return;x.preventDefault();let y=this.settings.side==="right"?-1:1;this.setSettings({width:this.settings.width+(x.key==="ArrowRight"?y:-y)*16})}),this.panel.append(g),this.status=document.createElement("div"),this.status.className="sr-only",this.status.setAttribute("role","status"),this.status.setAttribute("aria-live","polite"),this.root.append(this.status),this.oldPadding={left:document.documentElement.style.paddingLeft,right:document.documentElement.style.paddingRight},document.body.append(this.host),this.themeObserver=new MutationObserver(()=>this.syncTheme()),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["data-color-mode","data-dark-theme","class","style"]}),this.colorScheme.addEventListener("change",this.syncTheme),this.syncTheme(),this.render()}setCurrent(e){this.current?.id!==e?.id&&(this.current=e,this.render())}setState(e){let t=JSON.stringify(this.bookmarks)!==JSON.stringify(e.bookmarks),r=JSON.stringify(this.folders)!==JSON.stringify(e.folders);this.bookmarks=e.bookmarks,this.folders=e.folders,this.settings=e.settings,(t||r)&&this.renderList(),this.renderSettings(),this.renderFooter()}announce(e){this.status.textContent=e}syncTheme=()=>{let e=document.documentElement,t=e.getAttribute("data-color-mode"),r=t==="dark"||t==="auto"&&this.colorScheme.matches||!t&&(e.getAttribute("data-dark-theme")!==null||getComputedStyle(e).colorScheme.includes("dark"));this.host.dataset.theme=this.settings.theme==="auto"?r?"dark":"light":this.settings.theme};async setSettings(e,t=!1){this.settings={...this.settings,...e},this.renderSettings(),t&&(this.settings.open?this.search:this.handle).focus();try{await b({type:"settings",patch:e})}catch(r){this.announce(String(r))}}render(){this.renderList(),this.renderSettings(),this.renderFooter()}renderSettings(){this.host.dataset.open=String(this.settings.open),this.host.dataset.side=this.settings.side,this.host.style.setProperty("--panel-width",`${this.settings.width}px`),this.host.style.setProperty("--handle-ratio",String(this.settings.handleY/100)),this.syncTheme();let e=this.root.querySelector('[data-action="theme"]');e&&(e.title=`Theme: ${this.settings.theme}. Click to switch light/dark`);let t=this.root.querySelector(".resize");t?.setAttribute("aria-valuenow",String(this.settings.width)),t?.setAttribute("aria-valuetext",`${this.settings.width} pixels`),this.handle.setAttribute("aria-expanded",String(this.settings.open)),this.handle.setAttribute("aria-controls",this.panel.id),this.panel.setAttribute("aria-hidden",String(!this.settings.open)),this.panel.inert=!this.settings.open,this.pin.setAttribute("aria-pressed",String(this.settings.pinned)),this.pin.setAttribute("aria-label",this.settings.pinned?"Unpin sidebar":"Pin sidebar");let r=this.root.querySelector(".side-toggle");r&&r.setAttribute("aria-label",`Move sidebar to ${this.settings.side==="left"?"right":"left"}`),document.documentElement.style.paddingLeft=this.settings.open&&this.settings.pinned&&this.settings.side==="left"?`${this.settings.width}px`:this.oldPadding.left,document.documentElement.style.paddingRight=this.settings.open&&this.settings.pinned&&this.settings.side==="right"?`${this.settings.width}px`:this.oldPadding.right}renderFooter(){this.addCurrent.hidden=!this.current||this.bookmarks.some(e=>e.id===this.current?.id)}filter(){this.renderList()}renderList(){let e=this.root.activeElement,t=e?.closest("[data-id]")?.getAttribute("data-id"),r=e?.dataset.action;this.list.replaceChildren(),this.count.textContent=String(this.bookmarks.length);let o=R(this.bookmarks,this.search.value);for(let i of this.folders){let s=document.createElement("li");s.className="folder";let c=document.createElement("div");c.className="folder-header";let f=v(`${this.collapsed.has(i.id)?"Expand":"Collapse"} ${i.name}`,"chevron");f.classList.add("folder-toggle"),f.setAttribute("aria-expanded",String(!this.collapsed.has(i.id))),f.append(document.createTextNode(` ${i.name}`)),f.addEventListener("click",()=>{this.collapsed.delete(i.id)||this.collapsed.add(i.id),this.renderList()});let k=v(`Delete folder ${i.name}`,"trash");k.addEventListener("click",()=>{b({type:"remove-folder",id:i.id})}),c.append(f,k);let u=document.createElement("ul");if(u.className="folder-items",!this.collapsed.has(i.id)||this.search.value)for(let l of o.filter(p=>p.folderId===i.id))u.append(this.row(l));s.addEventListener("dragover",l=>{l.preventDefault(),s.classList.add("drop-target")}),s.addEventListener("dragleave",()=>s.classList.remove("drop-target")),s.addEventListener("drop",l=>{l.preventDefault(),s.classList.remove("drop-target");let p=l.dataTransfer?.getData("text/plain");p&&b({type:"move-folder",id:p,folderId:i.id})}),s.append(c,u),this.list.append(s)}for(let i of o.filter(s=>!s.folderId||!this.folders.some(c=>c.id===s.folderId)))this.list.append(this.row(i));let a=document.createElement("li");a.className="empty",a.textContent=this.bookmarks.length?"No repositories match your search.":"No bookmarks yet. Open a repository and save it here.",a.hidden=o.length>0,this.list.append(a),t&&r&&Array.from(this.list.children).find(s=>s.dataset.id===t)?.querySelector(`[data-action="${r}"]`)?.focus()}row(e){let t=document.createElement("li");t.className="bookmark-row",t.dataset.id=e.id,e.id===this.current?.id&&(t.dataset.active="true"),t.draggable=!0,t.addEventListener("dragstart",p=>{p.dataTransfer?.setData("text/plain",e.id),p.dataTransfer&&(p.dataTransfer.effectAllowed="move"),t.classList.add("dragging")}),t.addEventListener("dragend",()=>t.classList.remove("dragging")),t.addEventListener("dragover",p=>{p.preventDefault(),t.classList.add("drop-target")}),t.addEventListener("dragleave",()=>t.classList.remove("drop-target")),t.addEventListener("drop",p=>{p.preventDefault(),t.classList.remove("drop-target");let w=p.dataTransfer?.getData("text/plain");w&&this.reorder(w,e.id)});let r=document.createElement("span");r.className="grip",r.append(E("grip"));let o=document.createElement("a");o.href=e.url,o.className="repo-link",o.dataset.action="link";let a=document.createElement("strong");a.textContent=e.label||`${e.owner} / ${e.name}`;let i=document.createElement("small");i.textContent=new URL(e.origin).hostname,o.append(a,i);let s=document.createElement("div");s.className="row-actions";let c=v(`Move ${e.name} up`,"up");c.dataset.action="up",c.addEventListener("click",()=>{this.moveBy(e.id,-1)});let f=v(`Move ${e.name} down`,"down");f.dataset.action="down",f.addEventListener("click",()=>{this.moveBy(e.id,1)});let k=v(`Remove ${e.name}`,"trash");k.dataset.action="remove",k.addEventListener("click",()=>{this.remove(e.id)});let u=v(`Rename ${e.name}`,"edit");u.dataset.action="rename",u.addEventListener("click",()=>{this.rename(e)});let l=document.createElement("select");l.setAttribute("aria-label",`Folder for ${e.label||e.name}`),l.append(new Option("No folder",""));for(let p of this.folders)l.append(new Option(p.name,p.id));return l.value=e.folderId??"",l.addEventListener("change",()=>{b({type:"move-folder",id:e.id,folderId:l.value||null})}),s.append(l,u,c,f,k),t.append(r,o,s),t}async reorder(e,t){try{await b({type:"reorder",id:e,targetId:t}),this.announce("Bookmark moved")}catch(r){this.announce(String(r))}}async moveBy(e,t){let r=this.bookmarks.findIndex(a=>a.id===e),o=this.bookmarks[r+t];o&&await this.reorder(e,o.id)}async remove(e){try{await b({type:"remove",id:e}),this.announce("Bookmark removed")}catch(t){this.announce(String(t))}}async toggleCurrent(){if(this.current)try{await b({type:"toggle",url:this.current.url}),this.announce("Repository saved")}catch(e){this.announce(String(e))}}async rename(e){let t=prompt("Bookmark name (leave empty to restore the original)",e.label??`${e.owner} / ${e.name}`);t!==null&&await b({type:"rename",id:e.id,label:t})}async createFolder(){let e=prompt("New folder name");e?.trim()&&await b({type:"add-folder",name:e.trim().slice(0,100)})}startHandleDrag(e){if(e.button!==0)return;let t=e.clientX,r=e.clientY,o=!1;this.handle.setPointerCapture(e.pointerId);let a=s=>{if(Math.abs(s.clientY-r)+Math.abs(s.clientX-t)>6&&(o=!0),!o)return;let c=(s.clientY-36)/Math.max(1,innerHeight-72);this.settings.handleY=Math.max(0,Math.min(1,c))*100,this.settings.side=s.clientX<innerWidth/2?"left":"right",this.renderSettings()},i=()=>{if(this.handle.removeEventListener("pointermove",a),this.handle.removeEventListener("pointerup",i),this.handle.removeEventListener("pointercancel",i),o){let s=c=>c.stopImmediatePropagation();this.handle.addEventListener("click",s,{capture:!0}),window.setTimeout(()=>this.handle.removeEventListener("click",s,!0),0),this.setSettings({handleY:this.settings.handleY,side:this.settings.side})}};this.handle.addEventListener("pointermove",a),this.handle.addEventListener("pointerup",i),this.handle.addEventListener("pointercancel",i)}startResize(e,t){if(e.button!==0)return;e.preventDefault(),t.setPointerCapture(e.pointerId);let r=e.clientX,o=this.settings.width,a=s=>{let c=this.settings.side==="right"?-1:1;this.settings.width=Math.max(260,Math.min(520,o+(s.clientX-r)*c)),this.renderSettings()},i=()=>{t.removeEventListener("pointermove",a),t.removeEventListener("pointerup",i),t.removeEventListener("pointercancel",i),this.setSettings({width:this.settings.width})};t.addEventListener("pointermove",a),t.addEventListener("pointerup",i),t.addEventListener("pointercancel",i),this.resizeCleanup=i}destroy(){this.resizeCleanup?.(),this.themeObserver.disconnect(),this.colorScheme.removeEventListener("change",this.syncTheme),document.documentElement.style.paddingLeft=this.oldPadding.left,document.documentElement.style.paddingRight=this.oldPadding.right,this.host.remove()}};var F=`.ghb-action-wrap {
  display: inline-flex;
  align-items: center;
  margin-inline-start: 8px;
  list-style: none;
}
.ghb-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 30px;
  padding: 3px 11px;
  border: 1px solid var(--borderColor-default, #d1d9e0);
  border-radius: 6px;
  background: var(--button-default-bgColor-rest, #f6f8fa);
  color: var(--fgColor-default, #1f2328);
  font:
    600 12px/1.4 -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  cursor: pointer;
  transition:
    background-color 0.15s,
    transform 0.15s;
}
.ghb-action:hover {
  background: var(--button-default-bgColor-hover, #eaeef2);
}
.ghb-action:active {
  transform: scale(0.97);
}
.ghb-action:focus-visible {
  outline: 2px solid var(--focus-outlineColor, #0969da);
  outline-offset: 2px;
}
.ghb-action.ghb-saved {
  color: var(--fgColor-accent, #0969da);
}
.ghb-action.ghb-saved svg {
  fill: currentColor;
}
@media (max-width: 840px) {
  .ghb-action .ghb-label {
    display: none;
  }
  .ghb-action {
    padding-inline: 7px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ghb-action {
    transition: none;
  }
}
`;document.querySelector("gh-bookmarks")||Y();async function Y(){let n;try{n=await b({type:"state"})}catch{return}if(document.querySelector("gh-bookmarks"))return;let e=new A(n),t=document.createElement("style");t.dataset.ghb="button",t.textContent=F,document.head.append(t);let r=null,o=null,a=null,i="",s=0;function c(){return location.pathname.split("/").filter(Boolean).length===2}function f(){let d=M(location.href);return d&&P(document,d)?d:null}function k(){let d=document.querySelector('[data-testid="repo-header-actions"], ul.pagehead-actions, .pagehead-actions, #repository-container-header ul, [data-testid="repository-container-header"] .d-flex, #repository-container-header, [data-testid="repository-container-header"], #repo-title-component');if(d)return d;let h=Array.from(document.querySelectorAll("header h1, .repohead h1, .pagehead h1, h1")).find(m=>m.textContent?.toLocaleLowerCase().includes(r?.name.toLocaleLowerCase()??"\0"));return h?.closest("header, .repohead, .pagehead")??h?.parentElement??null}function u(){if(!o||!r)return;let d=n.bookmarks.some(m=>m.id===r?.id);o.setAttribute("aria-pressed",String(d)),o.setAttribute("aria-label",d?"Remove from favorites":"Add to favorites"),o.title=d?"Remove from favorites":"Add to favorites";let h=o.querySelector(".ghb-label");h&&(h.textContent=d?"Favorited":"Add favorite"),o.classList.toggle("ghb-saved",d)}function l(){a?.remove(),a=null,o=null}function p(){let d=r&&c()?k():null;if(!d){l();return}if(a?.isConnected&&a.parentElement===d){u();return}l();let h=d.tagName==="UL";a=document.createElement(h?"li":"span"),a.className="ghb-action-wrap",o=document.createElement("button"),o.type="button",o.className="ghb-action",o.append(E("bookmark"),Object.assign(document.createElement("span"),{className:"ghb-label"})),o.addEventListener("click",async m=>{if(m.preventDefault(),m.stopPropagation(),!r)return;let g=r,x=n.bookmarks.some(y=>y.id===g.id);n.bookmarks=x?n.bookmarks.filter(y=>y.id!==g.id):[{...g,addedAt:Date.now()},...n.bookmarks],u(),e.setState(n),e.announce(x?"Repository removed":"Repository saved");try{await b({type:"toggle",url:g.url})}catch(y){n=await T(),e.setState(n),u(),e.announce(String(y))}}),a.append(o),d.append(a),u()}function w(){let d=location.href,h=f(),m=d!==i||r?.id!==h?.id;i=d,r=h,m&&e.setCurrent(h),(m||r&&c()&&(!a?.isConnected||!o?.isConnected))&&p()}function L(){window.clearTimeout(s),s=window.setTimeout(w,90)}w();let S=new MutationObserver(d=>{(location.href!==i||r&&c()&&!a?.isConnected||d.some(h=>h.target instanceof HTMLElement&&(h.target.id==="repository-container-header"||h.target.classList.contains("pagehead-actions"))))&&L()});S.observe(document.body,{childList:!0,subtree:!0});for(let d of["turbo:load","turbo:render","soft-nav:end","pjax:end","popstate"])window.addEventListener(d,L);chrome.storage.onChanged.addListener((d,h)=>{h!=="local"||!["bookmarks","settings","hosts","folders"].some(m=>m in d)||T().then(m=>{n=m,e.setState(n),u()})}),window.addEventListener("pageshow",d=>{d.persisted&&L()}),window.addEventListener("pagehide",d=>{d.persisted||(S.disconnect(),e.destroy(),l(),t.remove())})}})();
