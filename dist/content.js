"use strict";(()=>{var C={open:!1,pinned:!1,side:"right",width:320},I=new Set(["about","account","apps","codespaces","collections","dashboard","enterprises","events","explore","features","gist","issues","login","logout","marketplace","new","notifications","organizations","orgs","pricing","pulls","search","security","sessions","settings","signup","sponsors","stars","team","topics","trending","users"]),R=/^[A-Za-z0-9_.-]+$/;function S(n){let t;try{t=new URL(n)}catch{return null}if(t.protocol!=="https:"||t.username||t.password||t.port)return null;let e=t.pathname.split("/").filter(Boolean),o=e[0],r=e[1];if(!o||!r||!R.test(o)||!R.test(r)||I.has(o.toLowerCase())||r==="."||r==="..")return null;let i=t.origin.toLowerCase();return{id:`${i}/${o.toLowerCase()}/${r.toLowerCase()}`,origin:i,owner:o,name:r,url:`${i}/${o}/${r}`}}function M(n){return!!n.querySelector('meta[name="octolytics-dimension-repository_id"], #repository-container-header, [data-testid="repository-container-header"], [data-hydro-click*="repository_id"]')}function N(n,t){let e=t.trim().toLocaleLowerCase();return e?n.filter(o=>`${o.owner} ${o.name} ${new URL(o.origin).hostname}`.toLocaleLowerCase().includes(e)):n}function P(n){let t=n&&typeof n=="object"?n:{};return{open:typeof t.open=="boolean"?t.open:C.open,pinned:typeof t.pinned=="boolean"?t.pinned:C.pinned,side:t.side==="left"?"left":"right",width:typeof t.width=="number"&&Number.isFinite(t.width)?Math.max(260,Math.min(520,Math.round(t.width))):C.width}}function z(n){if(!Array.isArray(n))return[];let t=new Set,e=[];for(let o of n){if(!o||typeof o!="object"||typeof o.url!="string")continue;let r=S(o.url);!r||t.has(r.id)||typeof o.addedAt!="number"||(t.add(r.id),e.push({...r,addedAt:o.addedAt}))}return e}async function T(){let n=await chrome.storage.local.get(["bookmarks","settings","hosts"]);return{bookmarks:z(n.bookmarks),settings:P(n.settings),hosts:Array.isArray(n.hosts)?n.hosts.filter(t=>typeof t=="string"):[]}}var V=Promise.resolve();async function v(n){let t=await chrome.runtime.sendMessage(n);if(!t?.ok)throw new Error(t?.error??"Extension unavailable");return t.data}var H={bookmark:"M5 3.5A1.5 1.5 0 0 1 6.5 2h5A1.5 1.5 0 0 1 13 3.5V15l-4-2.8L5 15V3.5Z",close:"M4 4l8 8m0-8-8 8",search:"M11.5 11.5 15 15M13 7.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z",pin:"M5 2h6l-1 4 2 2v1H4V8l2-2-1-4ZM8 9v5",chevron:"m5 3 5 5-5 5",settings:"M7.5 1v2m0 9v2M1 7.5h2m9 0h2M3 3l1.5 1.5m6 6L12 12M12 3l-1.5 1.5m-6 6L3 12M10 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z",trash:"M3 4h9m-7-2h5m1 2-.5 10h-6L4 4m2 2v6m3-6v6",up:"m3 10 4.5-5L12 10",down:"m3 5 4.5 5L12 5",grip:"M5 4h.01M10 4h.01M5 8h.01M10 8h.01M5 12h.01M10 12h.01",plus:"M8 2v12M2 8h12",arrow:"M3 8h10m-4-4 4 4-4 4"};function k(n,t=16){let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("viewBox","0 0 16 16"),e.setAttribute("width",String(t)),e.setAttribute("height",String(t)),e.setAttribute("fill","none"),e.setAttribute("stroke","currentColor"),e.setAttribute("stroke-width","1.6"),e.setAttribute("stroke-linecap","round"),e.setAttribute("stroke-linejoin","round"),e.setAttribute("aria-hidden","true");let o=document.createElementNS("http://www.w3.org/2000/svg","path");return o.setAttribute("d",H[n]??H.bookmark??""),e.append(o),e}function b(n,t,e="icon-button"){let o=document.createElement("button");return o.type="button",o.className=e,o.setAttribute("aria-label",n),o.title=n,o.append(k(t)),o}var $=`:host {
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
  top: 40%;
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
`;var A=class{host;root;panel;handle;list;search;count;addCurrent;pin;status;settings;bookmarks=[];current=null;themeObserver;colorScheme=matchMedia("(prefers-color-scheme: dark)");resizeCleanup=null;oldPadding={left:"",right:""};constructor(t){this.settings=t.settings,this.bookmarks=t.bookmarks,this.host=document.createElement("gh-bookmarks"),this.root=this.host.attachShadow({mode:"closed"});let e=document.createElement("style");e.textContent=$,this.root.append(e),this.handle=b("Open bookmarks","bookmark","edge-handle"),this.handle.addEventListener("click",()=>{this.setSettings({open:!0},!0)}),this.root.append(this.handle),this.panel=document.createElement("aside"),this.panel.className="panel",this.panel.setAttribute("aria-label","Repository bookmarks"),this.panel.id="bookmarks-panel",this.root.append(this.panel);let o=document.createElement("header");o.className="panel-header";let r=document.createElement("div");r.className="brand";let i=document.createElement("span");i.className="brand-mark",i.append(k("bookmark",18));let l=document.createElement("div");l.className="brand-text";let h=document.createElement("span");h.className="eyebrow",h.textContent="YOUR WORKSPACE";let u=document.createElement("strong");u.textContent="Bookmarks",l.append(h,u),r.append(i,l);let m=document.createElement("div");m.className="header-actions",this.pin=b("Pin sidebar","pin"),this.pin.addEventListener("click",()=>{this.setSettings({pinned:!this.settings.pinned})});let p=b("Move sidebar to left","arrow");p.classList.add("side-toggle"),p.addEventListener("click",()=>{this.setSettings({side:this.settings.side==="left"?"right":"left"})});let c=b("Close sidebar","close");c.addEventListener("click",()=>{this.setSettings({open:!1},!0)}),m.append(this.pin,p,c),o.append(r,m),this.panel.append(o);let g=document.createElement("label");g.className="search",g.append(k("search")),this.search=document.createElement("input"),this.search.type="search",this.search.placeholder="Find a repository\u2026",this.search.setAttribute("aria-label","Search bookmarks"),this.search.addEventListener("input",()=>this.filter()),g.append(this.search),this.panel.append(g);let w=document.createElement("section");w.className="favorites";let y=document.createElement("div");y.className="section-header";let E=document.createElement("h2");E.textContent="SAVED REPOSITORIES",this.count=document.createElement("span"),this.count.className="count",y.append(E,this.count),this.list=document.createElement("ul"),this.list.className="bookmark-list",w.append(y,this.list),this.panel.append(w);let s=document.createElement("footer");this.addCurrent=document.createElement("button"),this.addCurrent.type="button",this.addCurrent.className="add-current",this.addCurrent.append(k("plus"),document.createTextNode("Add current repository")),this.addCurrent.addEventListener("click",()=>{this.toggleCurrent()});let a=b("Manage Enterprise hosts","settings");a.addEventListener("click",()=>{chrome.runtime.openOptionsPage()}),s.append(this.addCurrent,a),this.panel.append(s);let d=document.createElement("div");d.className="resize",d.setAttribute("role","separator"),d.setAttribute("aria-label","Resize bookmarks sidebar"),d.setAttribute("aria-orientation","vertical"),d.tabIndex=0,d.addEventListener("pointerdown",f=>this.startResize(f,d)),d.addEventListener("keydown",f=>{if(f.key!=="ArrowLeft"&&f.key!=="ArrowRight")return;f.preventDefault();let x=this.settings.side==="right"?-1:1;this.setSettings({width:this.settings.width+(f.key==="ArrowRight"?x:-x)*16})}),this.panel.append(d),this.status=document.createElement("div"),this.status.className="sr-only",this.status.setAttribute("role","status"),this.status.setAttribute("aria-live","polite"),this.root.append(this.status),this.oldPadding={left:document.documentElement.style.paddingLeft,right:document.documentElement.style.paddingRight},document.body.append(this.host),this.themeObserver=new MutationObserver(()=>this.syncTheme()),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["data-color-mode","data-dark-theme","class","style"]}),this.colorScheme.addEventListener("change",this.syncTheme),this.syncTheme(),this.render()}setCurrent(t){this.current?.id!==t?.id&&(this.current=t,this.render())}setState(t){let e=JSON.stringify(this.bookmarks)!==JSON.stringify(t.bookmarks);this.bookmarks=t.bookmarks,this.settings=t.settings,e&&this.renderList(),this.renderSettings(),this.renderFooter()}announce(t){this.status.textContent=t}syncTheme=()=>{let t=document.documentElement,e=t.getAttribute("data-color-mode"),o=e==="dark"||e==="auto"&&this.colorScheme.matches||!e&&(t.getAttribute("data-dark-theme")!==null||getComputedStyle(t).colorScheme.includes("dark"));this.host.dataset.theme=o?"dark":"light"};async setSettings(t,e=!1){this.settings={...this.settings,...t},this.renderSettings(),e&&(this.settings.open?this.search:this.handle).focus();try{await v({type:"settings",patch:t})}catch(o){this.announce(String(o))}}render(){this.renderList(),this.renderSettings(),this.renderFooter()}renderSettings(){this.host.dataset.open=String(this.settings.open),this.host.dataset.side=this.settings.side,this.host.style.setProperty("--panel-width",`${this.settings.width}px`),this.handle.setAttribute("aria-expanded",String(this.settings.open)),this.handle.setAttribute("aria-controls",this.panel.id),this.panel.setAttribute("aria-hidden",String(!this.settings.open)),this.panel.inert=!this.settings.open,this.pin.setAttribute("aria-pressed",String(this.settings.pinned)),this.pin.setAttribute("aria-label",this.settings.pinned?"Unpin sidebar":"Pin sidebar");let t=this.root.querySelector(".side-toggle");t&&t.setAttribute("aria-label",`Move sidebar to ${this.settings.side==="left"?"right":"left"}`),document.documentElement.style.paddingLeft=this.settings.open&&this.settings.pinned&&this.settings.side==="left"?`${this.settings.width}px`:this.oldPadding.left,document.documentElement.style.paddingRight=this.settings.open&&this.settings.pinned&&this.settings.side==="right"?`${this.settings.width}px`:this.oldPadding.right}renderFooter(){this.addCurrent.hidden=!this.current||this.bookmarks.some(t=>t.id===this.current?.id)}filter(){let t=new Set(N(this.bookmarks,this.search.value).map(o=>o.id));for(let o of Array.from(this.list.children)){let r=o;r.dataset.id&&(r.hidden=!t.has(r.dataset.id))}let e=this.list.querySelector(".empty");e&&(e.hidden=t.size>0)}renderList(){let t=this.root.activeElement,e=t?.closest("[data-id]")?.getAttribute("data-id"),o=t?.dataset.action;this.list.replaceChildren(),this.count.textContent=String(this.bookmarks.length);for(let i of this.bookmarks)this.list.append(this.row(i));let r=document.createElement("li");r.className="empty",r.textContent=this.bookmarks.length?"No repositories match your search.":"No bookmarks yet. Open a repository and save it here.",r.hidden=this.bookmarks.length>0,this.list.append(r),this.filter(),e&&o&&Array.from(this.list.children).find(l=>l.dataset.id===e)?.querySelector(`[data-action="${o}"]`)?.focus()}row(t){let e=document.createElement("li");e.className="bookmark-row",e.dataset.id=t.id,t.id===this.current?.id&&(e.dataset.active="true"),e.draggable=!0,e.addEventListener("dragstart",c=>{c.dataTransfer?.setData("text/plain",t.id),c.dataTransfer&&(c.dataTransfer.effectAllowed="move"),e.classList.add("dragging")}),e.addEventListener("dragend",()=>e.classList.remove("dragging")),e.addEventListener("dragover",c=>{c.preventDefault(),e.classList.add("drop-target")}),e.addEventListener("dragleave",()=>e.classList.remove("drop-target")),e.addEventListener("drop",c=>{c.preventDefault(),e.classList.remove("drop-target");let g=c.dataTransfer?.getData("text/plain");g&&this.reorder(g,t.id)});let o=document.createElement("span");o.className="grip",o.append(k("grip"));let r=document.createElement("a");r.href=t.url,r.className="repo-link",r.dataset.action="link";let i=document.createElement("strong");i.textContent=`${t.owner} / ${t.name}`;let l=document.createElement("small");l.textContent=new URL(t.origin).hostname,r.append(i,l);let h=document.createElement("div");h.className="row-actions";let u=b(`Move ${t.name} up`,"up");u.dataset.action="up",u.addEventListener("click",()=>{this.moveBy(t.id,-1)});let m=b(`Move ${t.name} down`,"down");m.dataset.action="down",m.addEventListener("click",()=>{this.moveBy(t.id,1)});let p=b(`Remove ${t.name}`,"trash");return p.dataset.action="remove",p.addEventListener("click",()=>{this.remove(t.id)}),h.append(u,m,p),e.append(o,r,h),e}async reorder(t,e){try{await v({type:"reorder",id:t,targetId:e}),this.announce("Bookmark moved")}catch(o){this.announce(String(o))}}async moveBy(t,e){let o=this.bookmarks.findIndex(i=>i.id===t),r=this.bookmarks[o+e];r&&await this.reorder(t,r.id)}async remove(t){try{await v({type:"remove",id:t}),this.announce("Bookmark removed")}catch(e){this.announce(String(e))}}async toggleCurrent(){if(this.current)try{await v({type:"toggle",url:this.current.url}),this.announce("Repository saved")}catch(t){this.announce(String(t))}}startResize(t,e){if(t.button!==0)return;t.preventDefault(),e.setPointerCapture(t.pointerId);let o=t.clientX,r=this.settings.width,i=h=>{let u=this.settings.side==="right"?-1:1;this.settings.width=Math.max(260,Math.min(520,r+(h.clientX-o)*u)),this.renderSettings()},l=()=>{e.removeEventListener("pointermove",i),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l),this.setSettings({width:this.settings.width})};e.addEventListener("pointermove",i),e.addEventListener("pointerup",l),e.addEventListener("pointercancel",l),this.resizeCleanup=l}destroy(){this.resizeCleanup?.(),this.themeObserver.disconnect(),this.colorScheme.removeEventListener("change",this.syncTheme),document.documentElement.style.paddingLeft=this.oldPadding.left,document.documentElement.style.paddingRight=this.oldPadding.right,this.host.remove()}};var O=`.ghb-action-wrap {
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
`;document.querySelector("gh-bookmarks")||F();async function F(){let n;try{n=await v({type:"state"})}catch{return}if(document.querySelector("gh-bookmarks"))return;let t=new A(n),e=document.createElement("style");e.dataset.ghb="button",e.textContent=O,document.head.append(e);let o=null,r=null,i=null,l="",h=0;function u(){let s=S(location.href);return s&&M(document)?s:null}function m(){return document.querySelector('[data-testid="repo-header-actions"], .pagehead-actions, #repository-container-header ul, [data-testid="repository-container-header"] .d-flex, #repository-container-header')}function p(){if(!r||!o)return;let s=n.bookmarks.some(d=>d.id===o?.id);r.setAttribute("aria-pressed",String(s)),r.setAttribute("aria-label",s?"Remove from favorites":"Add to favorites"),r.title=s?"Remove from favorites":"Add to favorites";let a=r.querySelector(".ghb-label");a&&(a.textContent=s?"Favorited":"Add favorite"),r.classList.toggle("ghb-saved",s)}function c(){i?.remove(),i=null,r=null}function g(){let s=location.pathname.split("/").filter(Boolean).length===2,a=o&&s?m():null;if(!a){c();return}if(i?.isConnected&&i.parentElement===a){p();return}c();let d=a.tagName==="UL";i=document.createElement(d?"li":"span"),i.className="ghb-action-wrap",r=document.createElement("button"),r.type="button",r.className="ghb-action",r.append(k("bookmark"),Object.assign(document.createElement("span"),{className:"ghb-label"})),r.addEventListener("click",async f=>{if(f.preventDefault(),f.stopPropagation(),!o)return;let x=o,B=n.bookmarks.some(L=>L.id===x.id);n.bookmarks=B?n.bookmarks.filter(L=>L.id!==x.id):[{...x,addedAt:Date.now()},...n.bookmarks],p(),t.setState(n),t.announce(B?"Repository removed":"Repository saved");try{await v({type:"toggle",url:x.url})}catch(L){n=await T(),t.setState(n),p(),t.announce(String(L))}}),i.append(r),a.append(i),p()}function w(){let s=location.href,a=u(),d=s!==l||o?.id!==a?.id;l=s,o=a,d&&t.setCurrent(a),(d||!i?.isConnected||!r?.isConnected)&&g()}function y(){window.clearTimeout(h),h=window.setTimeout(w,90)}w();let E=new MutationObserver(s=>{(location.href!==l||o&&(!i?.isConnected||!M(document))||!o&&S(location.href)&&M(document)||s.some(a=>a.target instanceof HTMLElement&&(a.target.id==="repository-container-header"||a.target.classList.contains("pagehead-actions"))))&&y()});E.observe(document.body,{childList:!0,subtree:!0});for(let s of["turbo:load","turbo:render","soft-nav:end","pjax:end","popstate"])window.addEventListener(s,y);chrome.storage.onChanged.addListener((s,a)=>{a!=="local"||!["bookmarks","settings","hosts"].some(d=>d in s)||T().then(d=>{n=d,t.setState(n),p()})}),window.addEventListener("pagehide",()=>{E.disconnect(),t.destroy(),c(),e.remove()})}})();
