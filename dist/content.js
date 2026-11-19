"use strict";(()=>{var S={open:!1,pinned:!1,side:"right",width:320},I=new Set(["about","account","apps","codespaces","collections","dashboard","enterprises","events","explore","features","gist","issues","login","logout","marketplace","new","notifications","organizations","orgs","pricing","pulls","search","security","sessions","settings","signup","sponsors","stars","team","topics","trending","users"]),B=/^[A-Za-z0-9_.-]+$/;function C(n){let e;try{e=new URL(n)}catch{return null}if(e.protocol!=="https:"||e.username||e.password||e.port)return null;let t=e.pathname.split("/").filter(Boolean),o=t[0],r=t[1];if(!o||!r||!B.test(o)||!B.test(r)||I.has(o.toLowerCase())||r==="."||r==="..")return null;let s=e.origin.toLowerCase();return{id:`${s}/${o.toLowerCase()}/${r.toLowerCase()}`,origin:s,owner:o,name:r,url:`${s}/${o}/${r}`}}function R(n,e){let t=n.querySelector('meta[name="octolytics-dimension-repository_nwo"]')?.content;return t?t.trim().toLocaleLowerCase()===`${e.owner}/${e.name}`.toLocaleLowerCase():n.querySelector('meta[name="octolytics-dimension-repository_id"], #repository-container-header, [data-testid="repository-container-header"], [data-testid="repo-header-actions"]')?Array.from(n.querySelectorAll("header h1, .repohead h1, .pagehead h1, #repository-container-header h1")).some(r=>r.textContent?.toLocaleLowerCase().includes(e.name.toLocaleLowerCase())):!1}function N(n,e){let t=e.trim().toLocaleLowerCase();return t?n.filter(o=>`${o.owner} ${o.name} ${new URL(o.origin).hostname}`.toLocaleLowerCase().includes(t)):n}function P(n){let e=n&&typeof n=="object"?n:{};return{open:typeof e.open=="boolean"?e.open:S.open,pinned:typeof e.pinned=="boolean"?e.pinned:S.pinned,side:e.side==="left"?"left":"right",width:typeof e.width=="number"&&Number.isFinite(e.width)?Math.max(260,Math.min(520,Math.round(e.width))):S.width}}function z(n){if(!Array.isArray(n))return[];let e=new Set,t=[];for(let o of n){if(!o||typeof o!="object"||typeof o.url!="string")continue;let r=C(o.url);!r||e.has(r.id)||typeof o.addedAt!="number"||(e.add(r.id),t.push({...r,addedAt:o.addedAt}))}return t}async function M(){let n=await chrome.storage.local.get(["bookmarks","settings","hosts"]);return{bookmarks:z(n.bookmarks),settings:P(n.settings),hosts:Array.isArray(n.hosts)?n.hosts.filter(e=>typeof e=="string"):[]}}var V=Promise.resolve();async function v(n){let e=await chrome.runtime.sendMessage(n);if(!e?.ok)throw new Error(e?.error??"Extension unavailable");return e.data}var H={bookmark:"M5 3.5A1.5 1.5 0 0 1 6.5 2h5A1.5 1.5 0 0 1 13 3.5V15l-4-2.8L5 15V3.5Z",close:"M4 4l8 8m0-8-8 8",search:"M11.5 11.5 15 15M13 7.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z",pin:"M5 2h6l-1 4 2 2v1H4V8l2-2-1-4ZM8 9v5",chevron:"m5 3 5 5-5 5",settings:"M7.5 1v2m0 9v2M1 7.5h2m9 0h2M3 3l1.5 1.5m6 6L12 12M12 3l-1.5 1.5m-6 6L3 12M10 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z",trash:"M3 4h9m-7-2h5m1 2-.5 10h-6L4 4m2 2v6m3-6v6",up:"m3 10 4.5-5L12 10",down:"m3 5 4.5 5L12 5",grip:"M5 4h.01M10 4h.01M5 8h.01M10 8h.01M5 12h.01M10 12h.01",plus:"M8 2v12M2 8h12",arrow:"M3 8h10m-4-4 4 4-4 4"};function b(n,e=16){let t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("viewBox","0 0 16 16"),t.setAttribute("width",String(e)),t.setAttribute("height",String(e)),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","1.6"),t.setAttribute("stroke-linecap","round"),t.setAttribute("stroke-linejoin","round"),t.setAttribute("aria-hidden","true");let o=document.createElementNS("http://www.w3.org/2000/svg","path");return o.setAttribute("d",H[n]??H.bookmark??""),t.append(o),t}function f(n,e,t="icon-button"){let o=document.createElement("button");return o.type="button",o.className=t,o.setAttribute("aria-label",n),o.title=n,o.append(b(e)),o}var $=`:host {
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
`;var A=class{host;root;panel;handle;list;search;count;addCurrent;pin;status;settings;bookmarks=[];current=null;themeObserver;colorScheme=matchMedia("(prefers-color-scheme: dark)");resizeCleanup=null;oldPadding={left:"",right:""};constructor(e){this.settings=e.settings,this.bookmarks=e.bookmarks,this.host=document.createElement("gh-bookmarks"),this.root=this.host.attachShadow({mode:"closed"});let t=document.createElement("style");t.textContent=$,this.root.append(t),this.handle=f("Open bookmarks","bookmark","edge-handle"),this.handle.addEventListener("click",()=>{this.setSettings({open:!0},!0)}),this.root.append(this.handle),this.panel=document.createElement("aside"),this.panel.className="panel",this.panel.setAttribute("aria-label","Repository bookmarks"),this.panel.id="bookmarks-panel",this.root.append(this.panel);let o=document.createElement("header");o.className="panel-header";let r=document.createElement("div");r.className="brand";let s=document.createElement("span");s.className="brand-mark",s.append(b("bookmark",18));let l=document.createElement("div");l.className="brand-text";let p=document.createElement("span");p.className="eyebrow",p.textContent="YOUR WORKSPACE";let h=document.createElement("strong");h.textContent="Bookmarks",l.append(p,h),r.append(s,l);let m=document.createElement("div");m.className="header-actions",this.pin=f("Pin sidebar","pin"),this.pin.addEventListener("click",()=>{this.setSettings({pinned:!this.settings.pinned})});let g=f("Move sidebar to left","arrow");g.classList.add("side-toggle"),g.addEventListener("click",()=>{this.setSettings({side:this.settings.side==="left"?"right":"left"})});let c=f("Close sidebar","close");c.addEventListener("click",()=>{this.setSettings({open:!1},!0)}),m.append(this.pin,g,c),o.append(r,m),this.panel.append(o);let u=document.createElement("label");u.className="search",u.append(b("search")),this.search=document.createElement("input"),this.search.type="search",this.search.placeholder="Find a repository\u2026",this.search.setAttribute("aria-label","Search bookmarks"),this.search.addEventListener("input",()=>this.filter()),u.append(this.search),this.panel.append(u);let y=document.createElement("section");y.className="favorites";let x=document.createElement("div");x.className="section-header";let w=document.createElement("h2");w.textContent="SAVED REPOSITORIES",this.count=document.createElement("span"),this.count.className="count",x.append(w,this.count),this.list=document.createElement("ul"),this.list.className="bookmark-list",y.append(x,this.list),this.panel.append(y);let E=document.createElement("footer");this.addCurrent=document.createElement("button"),this.addCurrent.type="button",this.addCurrent.className="add-current",this.addCurrent.append(b("plus"),document.createTextNode("Add current repository")),this.addCurrent.addEventListener("click",()=>{this.toggleCurrent()});let i=f("Manage Enterprise hosts","settings");i.addEventListener("click",()=>{chrome.runtime.openOptionsPage()}),E.append(this.addCurrent,i),this.panel.append(E);let a=document.createElement("div");a.className="resize",a.setAttribute("role","separator"),a.setAttribute("aria-label","Resize bookmarks sidebar"),a.setAttribute("aria-orientation","vertical"),a.setAttribute("aria-valuemin","260"),a.setAttribute("aria-valuemax","520"),a.tabIndex=0,a.addEventListener("pointerdown",d=>this.startResize(d,a)),a.addEventListener("keydown",d=>{if(d.key!=="ArrowLeft"&&d.key!=="ArrowRight")return;d.preventDefault();let k=this.settings.side==="right"?-1:1;this.setSettings({width:this.settings.width+(d.key==="ArrowRight"?k:-k)*16})}),this.panel.append(a),this.status=document.createElement("div"),this.status.className="sr-only",this.status.setAttribute("role","status"),this.status.setAttribute("aria-live","polite"),this.root.append(this.status),this.oldPadding={left:document.documentElement.style.paddingLeft,right:document.documentElement.style.paddingRight},document.body.append(this.host),this.themeObserver=new MutationObserver(()=>this.syncTheme()),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["data-color-mode","data-dark-theme","class","style"]}),this.colorScheme.addEventListener("change",this.syncTheme),this.syncTheme(),this.render()}setCurrent(e){this.current?.id!==e?.id&&(this.current=e,this.render())}setState(e){let t=JSON.stringify(this.bookmarks)!==JSON.stringify(e.bookmarks);this.bookmarks=e.bookmarks,this.settings=e.settings,t&&this.renderList(),this.renderSettings(),this.renderFooter()}announce(e){this.status.textContent=e}syncTheme=()=>{let e=document.documentElement,t=e.getAttribute("data-color-mode"),o=t==="dark"||t==="auto"&&this.colorScheme.matches||!t&&(e.getAttribute("data-dark-theme")!==null||getComputedStyle(e).colorScheme.includes("dark"));this.host.dataset.theme=o?"dark":"light"};async setSettings(e,t=!1){this.settings={...this.settings,...e},this.renderSettings(),t&&(this.settings.open?this.search:this.handle).focus();try{await v({type:"settings",patch:e})}catch(o){this.announce(String(o))}}render(){this.renderList(),this.renderSettings(),this.renderFooter()}renderSettings(){this.host.dataset.open=String(this.settings.open),this.host.dataset.side=this.settings.side,this.host.style.setProperty("--panel-width",`${this.settings.width}px`);let e=this.root.querySelector(".resize");e?.setAttribute("aria-valuenow",String(this.settings.width)),e?.setAttribute("aria-valuetext",`${this.settings.width} pixels`),this.handle.setAttribute("aria-expanded",String(this.settings.open)),this.handle.setAttribute("aria-controls",this.panel.id),this.panel.setAttribute("aria-hidden",String(!this.settings.open)),this.panel.inert=!this.settings.open,this.pin.setAttribute("aria-pressed",String(this.settings.pinned)),this.pin.setAttribute("aria-label",this.settings.pinned?"Unpin sidebar":"Pin sidebar");let t=this.root.querySelector(".side-toggle");t&&t.setAttribute("aria-label",`Move sidebar to ${this.settings.side==="left"?"right":"left"}`),document.documentElement.style.paddingLeft=this.settings.open&&this.settings.pinned&&this.settings.side==="left"?`${this.settings.width}px`:this.oldPadding.left,document.documentElement.style.paddingRight=this.settings.open&&this.settings.pinned&&this.settings.side==="right"?`${this.settings.width}px`:this.oldPadding.right}renderFooter(){this.addCurrent.hidden=!this.current||this.bookmarks.some(e=>e.id===this.current?.id)}filter(){let e=new Set(N(this.bookmarks,this.search.value).map(o=>o.id));for(let o of Array.from(this.list.children)){let r=o;r.dataset.id&&(r.hidden=!e.has(r.dataset.id))}let t=this.list.querySelector(".empty");t&&(t.hidden=e.size>0)}renderList(){let e=this.root.activeElement,t=e?.closest("[data-id]")?.getAttribute("data-id"),o=e?.dataset.action;this.list.replaceChildren(),this.count.textContent=String(this.bookmarks.length);for(let s of this.bookmarks)this.list.append(this.row(s));let r=document.createElement("li");r.className="empty",r.textContent=this.bookmarks.length?"No repositories match your search.":"No bookmarks yet. Open a repository and save it here.",r.hidden=this.bookmarks.length>0,this.list.append(r),this.filter(),t&&o&&Array.from(this.list.children).find(l=>l.dataset.id===t)?.querySelector(`[data-action="${o}"]`)?.focus()}row(e){let t=document.createElement("li");t.className="bookmark-row",t.dataset.id=e.id,e.id===this.current?.id&&(t.dataset.active="true"),t.draggable=!0,t.addEventListener("dragstart",c=>{c.dataTransfer?.setData("text/plain",e.id),c.dataTransfer&&(c.dataTransfer.effectAllowed="move"),t.classList.add("dragging")}),t.addEventListener("dragend",()=>t.classList.remove("dragging")),t.addEventListener("dragover",c=>{c.preventDefault(),t.classList.add("drop-target")}),t.addEventListener("dragleave",()=>t.classList.remove("drop-target")),t.addEventListener("drop",c=>{c.preventDefault(),t.classList.remove("drop-target");let u=c.dataTransfer?.getData("text/plain");u&&this.reorder(u,e.id)});let o=document.createElement("span");o.className="grip",o.append(b("grip"));let r=document.createElement("a");r.href=e.url,r.className="repo-link",r.dataset.action="link";let s=document.createElement("strong");s.textContent=`${e.owner} / ${e.name}`;let l=document.createElement("small");l.textContent=new URL(e.origin).hostname,r.append(s,l);let p=document.createElement("div");p.className="row-actions";let h=f(`Move ${e.name} up`,"up");h.dataset.action="up",h.addEventListener("click",()=>{this.moveBy(e.id,-1)});let m=f(`Move ${e.name} down`,"down");m.dataset.action="down",m.addEventListener("click",()=>{this.moveBy(e.id,1)});let g=f(`Remove ${e.name}`,"trash");return g.dataset.action="remove",g.addEventListener("click",()=>{this.remove(e.id)}),p.append(h,m,g),t.append(o,r,p),t}async reorder(e,t){try{await v({type:"reorder",id:e,targetId:t}),this.announce("Bookmark moved")}catch(o){this.announce(String(o))}}async moveBy(e,t){let o=this.bookmarks.findIndex(s=>s.id===e),r=this.bookmarks[o+t];r&&await this.reorder(e,r.id)}async remove(e){try{await v({type:"remove",id:e}),this.announce("Bookmark removed")}catch(t){this.announce(String(t))}}async toggleCurrent(){if(this.current)try{await v({type:"toggle",url:this.current.url}),this.announce("Repository saved")}catch(e){this.announce(String(e))}}startResize(e,t){if(e.button!==0)return;e.preventDefault(),t.setPointerCapture(e.pointerId);let o=e.clientX,r=this.settings.width,s=p=>{let h=this.settings.side==="right"?-1:1;this.settings.width=Math.max(260,Math.min(520,r+(p.clientX-o)*h)),this.renderSettings()},l=()=>{t.removeEventListener("pointermove",s),t.removeEventListener("pointerup",l),t.removeEventListener("pointercancel",l),this.setSettings({width:this.settings.width})};t.addEventListener("pointermove",s),t.addEventListener("pointerup",l),t.addEventListener("pointercancel",l),this.resizeCleanup=l}destroy(){this.resizeCleanup?.(),this.themeObserver.disconnect(),this.colorScheme.removeEventListener("change",this.syncTheme),document.documentElement.style.paddingLeft=this.oldPadding.left,document.documentElement.style.paddingRight=this.oldPadding.right,this.host.remove()}};var O=`.ghb-action-wrap {
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
`;document.querySelector("gh-bookmarks")||q();async function q(){let n;try{n=await v({type:"state"})}catch{return}if(document.querySelector("gh-bookmarks"))return;let e=new A(n),t=document.createElement("style");t.dataset.ghb="button",t.textContent=O,document.head.append(t);let o=null,r=null,s=null,l="",p=0;function h(){return location.pathname.split("/").filter(Boolean).length===2}function m(){let i=C(location.href);return i&&R(document,i)?i:null}function g(){let i=document.querySelector('[data-testid="repo-header-actions"], .pagehead-actions, #repository-container-header ul, [data-testid="repository-container-header"] .d-flex, #repository-container-header');return i||(Array.from(document.querySelectorAll("header h1, .repohead h1, .pagehead h1")).find(d=>d.textContent?.toLocaleLowerCase().includes(o?.name.toLocaleLowerCase()??"\0"))?.closest("header, .repohead, .pagehead")??null)}function c(){if(!r||!o)return;let i=n.bookmarks.some(d=>d.id===o?.id);r.setAttribute("aria-pressed",String(i)),r.setAttribute("aria-label",i?"Remove from favorites":"Add to favorites"),r.title=i?"Remove from favorites":"Add to favorites";let a=r.querySelector(".ghb-label");a&&(a.textContent=i?"Favorited":"Add favorite"),r.classList.toggle("ghb-saved",i)}function u(){s?.remove(),s=null,r=null}function y(){let i=o&&h()?g():null;if(!i){u();return}if(s?.isConnected&&s.parentElement===i){c();return}u();let a=i.tagName==="UL";s=document.createElement(a?"li":"span"),s.className="ghb-action-wrap",r=document.createElement("button"),r.type="button",r.className="ghb-action",r.append(b("bookmark"),Object.assign(document.createElement("span"),{className:"ghb-label"})),r.addEventListener("click",async d=>{if(d.preventDefault(),d.stopPropagation(),!o)return;let k=o,T=n.bookmarks.some(L=>L.id===k.id);n.bookmarks=T?n.bookmarks.filter(L=>L.id!==k.id):[{...k,addedAt:Date.now()},...n.bookmarks],c(),e.setState(n),e.announce(T?"Repository removed":"Repository saved");try{await v({type:"toggle",url:k.url})}catch(L){n=await M(),e.setState(n),c(),e.announce(String(L))}}),s.append(r),i.append(s),c()}function x(){let i=location.href,a=m(),d=i!==l||o?.id!==a?.id;l=i,o=a,d&&e.setCurrent(a),(d||o&&h()&&(!s?.isConnected||!r?.isConnected))&&y()}function w(){window.clearTimeout(p),p=window.setTimeout(x,90)}x();let E=new MutationObserver(i=>{(location.href!==l||o&&h()&&!s?.isConnected||i.some(a=>a.target instanceof HTMLElement&&(a.target.id==="repository-container-header"||a.target.classList.contains("pagehead-actions"))))&&w()});E.observe(document.body,{childList:!0,subtree:!0});for(let i of["turbo:load","turbo:render","soft-nav:end","pjax:end","popstate"])window.addEventListener(i,w);chrome.storage.onChanged.addListener((i,a)=>{a!=="local"||!["bookmarks","settings","hosts"].some(d=>d in i)||M().then(d=>{n=d,e.setState(n),c()})}),window.addEventListener("pageshow",i=>{i.persisted&&w()}),window.addEventListener("pagehide",i=>{i.persisted||(E.disconnect(),e.destroy(),u(),t.remove())})}})();
