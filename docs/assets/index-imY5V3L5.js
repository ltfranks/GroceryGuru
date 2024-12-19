(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();var q,ke;class lt extends Error{}lt.prototype.name="InvalidTokenError";function Ys(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Gs(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ys(t)}catch{return atob(t)}}function ss(i,t){if(typeof i!="string")throw new lt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new lt(`Invalid token specified: missing part #${e+1}`);let r;try{r=Gs(s)}catch(o){throw new lt(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(r)}catch(o){throw new lt(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const Ks="mu:context",Xt=`${Ks}:change`;class Js{constructor(t,e){this._proxy=Zs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ne extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Js(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Xt,t),t}detach(t){this.removeEventListener(Xt,t)}}function Zs(i,t){return new Proxy(i,{get:(s,r,o)=>{if(r==="then")return;const n=Reflect.get(s,r,o);return console.log(`Context['${r}'] => `,n),n},set:(s,r,o,n)=>{const c=i[r];console.log(`Context['${r.toString()}'] <= `,o);const a=Reflect.set(s,r,o,n);if(a){let d=new CustomEvent(Xt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:r,oldValue:c,value:o}),t.dispatchEvent(d)}else console.log(`Context['${r}] was not set to ${o}`);return a}})}function Xs(i,t){const e=rs(t,i);return new Promise((s,r)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function rs(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return rs(i,r.host)}class tr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function is(i="mu:message"){return(t,...e)=>t.dispatchEvent(new tr(e,i))}class oe{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function er(i){return t=>({...t,...i})}const te="mu:auth:jwt",ns=class os extends oe{constructor(t,e){super((s,r)=>this.update(s,r),t,os.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(rr(s)),Wt(r);case"auth/signout":return e(ir()),Wt(this._redirectForLogin);case"auth/redirect":return Wt(this._redirectForLogin,{next:window.location.href});default:const o=t[0];throw new Error(`Unhandled Auth message "${o}"`)}}};ns.EVENT_TYPE="auth:message";let as=ns;const cs=is(as.EVENT_TYPE);function Wt(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,o])=>s.searchParams.set(r,o)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class sr extends ne{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=G.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new as(this.context,this.redirect).attach(this)}}class Y{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(te),t}}class G extends Y{constructor(t){super();const e=ss(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new G(t);return localStorage.setItem(te,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(te);return t?G.authenticate(t):new Y}}function rr(i){return er({user:G.authenticate(i),token:i})}function ir(){return i=>{const t=i.user;return{user:t&&t.authenticated?Y.deauthenticate(t):t,token:""}}}function nr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function or(i){return i.authenticated?ss(i.token||""):{}}const Lt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:G,Provider:sr,User:Y,dispatch:cs,headers:nr,payload:or},Symbol.toStringTag,{value:"Module"}));function Pt(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function ee(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const ar=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ee,relay:Pt},Symbol.toStringTag,{value:"Module"}));function ls(i,...t){const e=i.map((r,o)=>o?[t[o-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const cr=new DOMParser;function j(i,...t){const e=t.map(c),s=i.map((a,d)=>{if(d===0)return[a];const p=e[d-1];return p instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[p,a]}).flat().join(""),r=cr.parseFromString(s,"text/html"),o=r.head.childElementCount?r.head.children:r.body.children,n=new DocumentFragment;return n.replaceChildren(...o),e.forEach((a,d)=>{if(a instanceof Node){const p=n.querySelector(`ins#mu-html-${d}`);if(p){const u=p.parentNode;u==null||u.replaceChild(a,p)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),n;function c(a,d){if(a===null)return"";switch(typeof a){case"string":return Pe(a);case"bigint":case"boolean":case"number":case"symbol":return Pe(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const p=new DocumentFragment,u=a.map(c);return p.replaceChildren(...u),p}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Pe(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function jt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:o};return s;function r(n){const c=n.firstElementChild,a=c&&c.tagName==="TEMPLATE"?c:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function o(...n){e.adoptedStyleSheets=n}}q=class extends HTMLElement{constructor(){super(),this._state={},jt(this).template(q.template).styles(q.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Pt(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},lr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},q.template=j`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,q.styles=ls`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function lr(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!r;break;case"date":n.value=r.toISOString().substr(0,10);break;default:n.value=r;break}}}return i}const hs=class us extends oe{constructor(t){super((e,s)=>this.update(e,s),t,us.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(ur(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(dr(s,r));break}}}};hs.EVENT_TYPE="history:message";let ae=hs;class Ce extends ne{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=hr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ce(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ae(this.context).attach(this)}}function hr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ur(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function dr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const ce=is(ae.EVENT_TYPE),pr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ce,Provider:Ce,Service:ae,dispatch:ce},Symbol.toStringTag,{value:"Module"}));class pt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Te(this._provider,t);this._effects.push(r),e(r)}else Xs(this._target,this._contextLabel).then(r=>{const o=new Te(r,t);this._provider=r,this._effects.push(o),r.attach(n=>this._handleChange(n)),e(o)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Te{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ds=class ps extends HTMLElement{constructor(){super(),this._state={},this._user=new Y,this._authObserver=new pt(this,"blazing:auth"),jt(this).template(ps.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;fr(r,this._state,e,this.authorization).then(o=>nt(o,this)).then(o=>{const n=`mu-rest-form:${s}`,c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:o,url:r}});this.dispatchEvent(c)}).catch(o=>{const n="mu-rest-form:error",c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:r,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},nt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Oe(this.src,this.authorization).then(e=>{this._state=e,nt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Oe(this.src,this.authorization).then(r=>{this._state=r,nt(r,this)});break;case"new":s&&(this._state={},nt({},this));break}}};ds.observedAttributes=["src","new","action"];ds.template=j`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Oe(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function nt(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!r;break;default:n.value=r;break}}}return i}function fr(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const fs=class ms extends oe{constructor(t,e){super(e,t,ms.EVENT_TYPE,!1)}};fs.EVENT_TYPE="mu:message";let gs=fs;class mr extends ne{constructor(t,e,s){super(e),this._user=new Y,this._updateFn=t,this._authObserver=new pt(this,s)}connectedCallback(){const t=new gs(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const ys=Object.freeze(Object.defineProperty({__proto__:null,Provider:mr,Service:gs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const St=globalThis,le=St.ShadowRoot&&(St.ShadyCSS===void 0||St.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),Re=new WeakMap;let vs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(le&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Re.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Re.set(e,t))}return t}toString(){return this.cssText}};const gr=i=>new vs(typeof i=="string"?i:i+"",void 0,he),yr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new vs(e,i,he)},vr=(i,t)=>{if(le)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=St.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ue=le?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return gr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:_r,defineProperty:$r,getOwnPropertyDescriptor:br,getOwnPropertyNames:wr,getOwnPropertySymbols:Ar,getPrototypeOf:xr}=Object,K=globalThis,Ne=K.trustedTypes,Er=Ne?Ne.emptyScript:"",Me=K.reactiveElementPolyfillSupport,ht=(i,t)=>i,Ct={toAttribute(i,t){switch(t){case Boolean:i=i?Er:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ue=(i,t)=>!_r(i,t),Ie={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),K.litPropertyMetadata??(K.litPropertyMetadata=new WeakMap);let B=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ie){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&$r(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=br(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return r==null?void 0:r.call(this)},set(n){const c=r==null?void 0:r.call(this);o.call(this,n),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ie}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;const t=xr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){const e=this.properties,s=[...wr(e),...Ar(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ue(r))}else t!==void 0&&e.push(Ue(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(o!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Ct).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,o=r._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const n=r.getPropertyOptions(o),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:Ct;this._$Em=o,this[o]=c.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ue)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[ht("elementProperties")]=new Map,B[ht("finalized")]=new Map,Me==null||Me({ReactiveElement:B}),(K.reactiveElementVersions??(K.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Ot=Tt.trustedTypes,Le=Ot?Ot.createPolicy("lit-html",{createHTML:i=>i}):void 0,_s="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,$s="?"+P,Sr=`<${$s}>`,H=document,ft=()=>H.createComment(""),mt=i=>i===null||typeof i!="object"&&typeof i!="function",de=Array.isArray,kr=i=>de(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Yt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,je=/-->/g,He=/>/g,N=RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ze=/'/g,De=/"/g,bs=/^(?:script|style|textarea|title)$/i,Pr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),at=Pr(1),J=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Fe=new WeakMap,I=H.createTreeWalker(H,129);function ws(i,t){if(!de(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Le!==void 0?Le.createHTML(t):t}const Cr=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=ot;for(let c=0;c<e;c++){const a=i[c];let d,p,u=-1,l=0;for(;l<a.length&&(n.lastIndex=l,p=n.exec(a),p!==null);)l=n.lastIndex,n===ot?p[1]==="!--"?n=je:p[1]!==void 0?n=He:p[2]!==void 0?(bs.test(p[2])&&(r=RegExp("</"+p[2],"g")),n=N):p[3]!==void 0&&(n=N):n===N?p[0]===">"?(n=r??ot,u=-1):p[1]===void 0?u=-2:(u=n.lastIndex-p[2].length,d=p[1],n=p[3]===void 0?N:p[3]==='"'?De:ze):n===De||n===ze?n=N:n===je||n===He?n=ot:(n=N,r=void 0);const h=n===N&&i[c+1].startsWith("/>")?" ":"";o+=n===ot?a+Sr:u>=0?(s.push(d),a.slice(0,u)+_s+a.slice(u)+P+h):a+P+(u===-2?c:h)}return[ws(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let se=class As{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const c=t.length-1,a=this.parts,[d,p]=Cr(t,e);if(this.el=As.createElement(d,s),I.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=I.nextNode())!==null&&a.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(_s)){const l=p[n++],h=r.getAttribute(u).split(P),f=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:f[2],strings:h,ctor:f[1]==="."?Or:f[1]==="?"?Rr:f[1]==="@"?Ur:Ht}),r.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:o}),r.removeAttribute(u));if(bs.test(r.tagName)){const u=r.textContent.split(P),l=u.length-1;if(l>0){r.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<l;h++)r.append(u[h],ft()),I.nextNode(),a.push({type:2,index:++o});r.append(u[l],ft())}}}else if(r.nodeType===8)if(r.data===$s)a.push({type:2,index:o});else{let u=-1;for(;(u=r.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:o}),u+=P.length-1}o++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function Z(i,t,e=i,s){var r,o;if(t===J)return t;let n=s!==void 0?(r=e.o)==null?void 0:r[s]:e.l;const c=mt(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==c&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),c===void 0?n=void 0:(n=new c(i),n._$AT(i,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=n:e.l=n),n!==void 0&&(t=Z(i,n._$AS(i,t.values),n,s)),t}class Tr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??H).importNode(e,!0);I.currentNode=r;let o=I.nextNode(),n=0,c=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new bt(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new Nr(o,this,t)),this._$AV.push(d),a=s[++c]}n!==(a==null?void 0:a.index)&&(o=I.nextNode(),n++)}return I.currentNode=H,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class bt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),mt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==J&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):kr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=se.createElement(ws(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(s);else{const n=new Tr(o,this),c=n.u(this.options);n.p(s),this.T(c),this._$AH=n}}_$AC(t){let e=Fe.get(t.strings);return e===void 0&&Fe.set(t.strings,e=new se(t)),e}k(t){de(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new bt(this.O(ft()),this.O(ft()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Ht{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=Z(this,t,e,0),n=!mt(t)||t!==this._$AH&&t!==J,n&&(this._$AH=t);else{const c=t;let a,d;for(t=o[0],a=0;a<o.length-1;a++)d=Z(this,c[s+a],e,a),d===J&&(d=this._$AH[a]),n||(n=!mt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Or extends Ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Rr extends Ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Ur extends Ht{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??$)===J)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Nr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const qe=Tt.litHtmlPolyfillSupport;qe==null||qe(se,bt),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.2.0");const Mr=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new bt(t.insertBefore(ft(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let W=class extends B{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Mr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return J}};W._$litElement$=!0,W.finalized=!0,(ke=globalThis.litElementHydrateSupport)==null||ke.call(globalThis,{LitElement:W});const Ve=globalThis.litElementPolyfillSupport;Ve==null||Ve({LitElement:W});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ir={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ue},Lr=(i=Ir,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i)},init(c){return c!==void 0&&this.P(n,void 0,i),c}}}if(s==="setter"){const{name:n}=e;return function(c){const a=this[n];t.call(this,c),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function xs(i){return(t,e)=>typeof e=="object"?Lr(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Es(i){return xs({...i,state:!0,attribute:!1})}function jr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Hr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ss={};(function(i){var t=function(){var e=function(u,l,h,f){for(h=h||{},f=u.length;f--;h[u[f]]=l);return h},s=[1,9],r=[1,10],o=[1,11],n=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,h,f,g,m,v,Ft){var A=v.length-1;switch(m){case 1:return new g.Root({},[v[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new g.Literal({value:v[A]});break;case 7:this.$=new g.Splat({name:v[A]});break;case 8:this.$=new g.Param({name:v[A]});break;case 9:this.$=new g.Optional({},[v[A-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[2,2]},e(c,[2,4]),e(c,[2,5]),e(c,[2,6]),e(c,[2,7]),e(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},e(c,[2,10]),e(c,[2,11]),e(c,[2,12]),{1:[2,1]},e(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:o,15:n},e(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,h){if(h.recoverable)this.trace(l);else{let f=function(g,m){this.message=g,this.hash=m};throw f.prototype=Error,new f(l,h)}},parse:function(l){var h=this,f=[0],g=[null],m=[],v=this.table,Ft="",A=0,xe=0,Vs=2,Ee=1,Bs=m.slice.call(arguments,1),_=Object.create(this.lexer),R={yy:{}};for(var qt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,qt)&&(R.yy[qt]=this.yy[qt]);_.setInput(l,R.yy),R.yy.lexer=_,R.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Vt=_.yylloc;m.push(Vt);var Qs=_.options&&_.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ws=function(){var F;return F=_.lex()||Ee,typeof F!="number"&&(F=h.symbols_[F]||F),F},w,U,x,Bt,D={},xt,E,Se,Et;;){if(U=f[f.length-1],this.defaultActions[U]?x=this.defaultActions[U]:((w===null||typeof w>"u")&&(w=Ws()),x=v[U]&&v[U][w]),typeof x>"u"||!x.length||!x[0]){var Qt="";Et=[];for(xt in v[U])this.terminals_[xt]&&xt>Vs&&Et.push("'"+this.terminals_[xt]+"'");_.showPosition?Qt="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+Et.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Qt="Parse error on line "+(A+1)+": Unexpected "+(w==Ee?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Qt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Vt,expected:Et})}if(x[0]instanceof Array&&x.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+w);switch(x[0]){case 1:f.push(w),g.push(_.yytext),m.push(_.yylloc),f.push(x[1]),w=null,xe=_.yyleng,Ft=_.yytext,A=_.yylineno,Vt=_.yylloc;break;case 2:if(E=this.productions_[x[1]][1],D.$=g[g.length-E],D._$={first_line:m[m.length-(E||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(E||1)].first_column,last_column:m[m.length-1].last_column},Qs&&(D._$.range=[m[m.length-(E||1)].range[0],m[m.length-1].range[1]]),Bt=this.performAction.apply(D,[Ft,xe,A,R.yy,x[1],g,m].concat(Bs)),typeof Bt<"u")return Bt;E&&(f=f.slice(0,-1*E*2),g=g.slice(0,-1*E),m=m.slice(0,-1*E)),f.push(this.productions_[x[1]][0]),g.push(D.$),m.push(D._$),Se=v[f[f.length-2]][f[f.length-1]],f.push(Se);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,f){if(this.yy.parser)this.yy.parser.parseError(h,f);else throw new Error(h)},setInput:function(l,h){return this.yy=h||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var h=l.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var h=l.length,f=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),f.length-1&&(this.yylineno-=f.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:f?(f.length===g.length?this.yylloc.first_column:0)+g[g.length-f.length].length-f[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),h=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+h+"^"},test_match:function(l,h){var f,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=l[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],f=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),f)return f;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,h,f,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(f=this._input.match(this.rules[m[v]]),f&&(!h||f[0].length>h[0].length)){if(h=f,g=v,this.options.backtrack_lexer){if(l=this.test_match(f,m[v]),l!==!1)return l;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(l=this.test_match(h,m[g]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,f,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function p(){this.yy={}}return p.prototype=a,a.Parser=p,new p}();typeof Hr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Ss);function V(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var ks={Root:V("Root"),Concat:V("Concat"),Literal:V("Literal"),Splat:V("Splat"),Param:V("Param"),Optional:V("Optional")},Ps=Ss.parser;Ps.yy=ks;var zr=Ps,Dr=Object.keys(ks);function Fr(i){return Dr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Cs=Fr,qr=Cs,Vr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ts(i){this.captures=i.captures,this.re=i.re}Ts.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Br=qr({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Vr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Ts({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Qr=Br,Wr=Cs,Yr=Wr({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Gr=Yr,Kr=zr,Jr=Qr,Zr=Gr;wt.prototype=Object.create(null);wt.prototype.match=function(i){var t=Jr.visit(this.ast),e=t.match(i);return e||!1};wt.prototype.reverse=function(i){return Zr.visit(this.ast,i)};function wt(i){var t;if(this?t=this:t=Object.create(wt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Kr.parse(i),t}var Xr=wt,ti=Xr,ei=ti;const si=jr(ei);var ri=Object.defineProperty,Os=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&ri(t,e,r),r};const Rs=class extends W{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>at` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new si(r.path)})),this._historyObserver=new pt(this,e),this._authObserver=new pt(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),at` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(cs(this,"auth/redirect"),at` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):at` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),at` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),o=s+e;for(const n of this._cases){const c=n.route.match(o);if(c)return{...n,path:s,params:c,query:r}}}redirect(t){ce(this,"history/redirect",{href:t})}};Rs.styles=yr`
    :host,
    main {
      display: contents;
    }
  `;let Rt=Rs;Os([Es()],Rt.prototype,"_user");Os([Es()],Rt.prototype,"_match");const ii=Object.freeze(Object.defineProperty({__proto__:null,Element:Rt,Switch:Rt},Symbol.toStringTag,{value:"Module"})),ni=class Us extends HTMLElement{constructor(){if(super(),jt(this).template(Us.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ni.template=j`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Ns=class re extends HTMLElement{constructor(){super(),this._array=[],jt(this).template(re.template).styles(re.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ms("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ee(t,"button.add")?Pt(t,"input-array:add"):ee(t,"button.remove")&&Pt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],oi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Ns.template=j`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ns.styles=ls`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
    }
  `;function oi(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Ms(e)))}function Ms(i,t){const e=i===void 0?j`<input />`:j`<input value="${i}" />`;return j`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function st(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ai=Object.defineProperty,ci=Object.getOwnPropertyDescriptor,li=(i,t,e,s)=>{for(var r=ci(t,e),o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&ai(t,e,r),r};class zt extends W{constructor(t){super(),this._pending=[],this._observer=new pt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}li([xs()],zt.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,pe=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),Be=new WeakMap;let Is=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Be.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Be.set(e,t))}return t}toString(){return this.cssText}};const hi=i=>new Is(typeof i=="string"?i:i+"",void 0,fe),rt=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new Is(e,i,fe)},ui=(i,t)=>{if(pe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=kt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Qe=pe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return hi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:di,defineProperty:pi,getOwnPropertyDescriptor:fi,getOwnPropertyNames:mi,getOwnPropertySymbols:gi,getPrototypeOf:yi}=Object,T=globalThis,We=T.trustedTypes,vi=We?We.emptyScript:"",Gt=T.reactiveElementPolyfillSupport,ut=(i,t)=>i,Ut={toAttribute(i,t){switch(t){case Boolean:i=i?vi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},me=(i,t)=>!di(i,t),Ye={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:me};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),T.litPropertyMetadata??(T.litPropertyMetadata=new WeakMap);class Q extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ye){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&pi(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=fi(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return r==null?void 0:r.call(this)},set(n){const c=r==null?void 0:r.call(this);o.call(this,n),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ye}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=yi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...mi(e),...gi(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Qe(r))}else t!==void 0&&e.push(Qe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ui(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var o;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Ut).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){var o;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const n=s.getPropertyOptions(r),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:Ut;this._$Em=r,this[r]=c.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??me)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(e)):this._$EU()}catch(r){throw t=!1,this._$EU(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[ut("elementProperties")]=new Map,Q[ut("finalized")]=new Map,Gt==null||Gt({ReactiveElement:Q}),(T.reactiveElementVersions??(T.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt=globalThis,Nt=dt.trustedTypes,Ge=Nt?Nt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ls="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,js="?"+C,_i=`<${js}>`,z=document,gt=()=>z.createComment(""),yt=i=>i===null||typeof i!="object"&&typeof i!="function",ge=Array.isArray,$i=i=>ge(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Kt=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ke=/-->/g,Je=/>/g,M=RegExp(`>|${Kt}(?:([^\\s"'>=/]+)(${Kt}*=${Kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ze=/'/g,Xe=/"/g,Hs=/^(?:script|style|textarea|title)$/i,bi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),y=bi(1),X=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ts=new WeakMap,L=z.createTreeWalker(z,129);function zs(i,t){if(!ge(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ge!==void 0?Ge.createHTML(t):t}const wi=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=ct;for(let c=0;c<e;c++){const a=i[c];let d,p,u=-1,l=0;for(;l<a.length&&(n.lastIndex=l,p=n.exec(a),p!==null);)l=n.lastIndex,n===ct?p[1]==="!--"?n=Ke:p[1]!==void 0?n=Je:p[2]!==void 0?(Hs.test(p[2])&&(r=RegExp("</"+p[2],"g")),n=M):p[3]!==void 0&&(n=M):n===M?p[0]===">"?(n=r??ct,u=-1):p[1]===void 0?u=-2:(u=n.lastIndex-p[2].length,d=p[1],n=p[3]===void 0?M:p[3]==='"'?Xe:Ze):n===Xe||n===Ze?n=M:n===Ke||n===Je?n=ct:(n=M,r=void 0);const h=n===M&&i[c+1].startsWith("/>")?" ":"";o+=n===ct?a+_i:u>=0?(s.push(d),a.slice(0,u)+Ls+a.slice(u)+C+h):a+C+(u===-2?c:h)}return[zs(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class vt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const c=t.length-1,a=this.parts,[d,p]=wi(t,e);if(this.el=vt.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=L.nextNode())!==null&&a.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Ls)){const l=p[n++],h=r.getAttribute(u).split(C),f=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:f[2],strings:h,ctor:f[1]==="."?xi:f[1]==="?"?Ei:f[1]==="@"?Si:Dt}),r.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:o}),r.removeAttribute(u));if(Hs.test(r.tagName)){const u=r.textContent.split(C),l=u.length-1;if(l>0){r.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<l;h++)r.append(u[h],gt()),L.nextNode(),a.push({type:2,index:++o});r.append(u[l],gt())}}}else if(r.nodeType===8)if(r.data===js)a.push({type:2,index:o});else{let u=-1;for(;(u=r.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:o}),u+=C.length-1}o++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function tt(i,t,e=i,s){var n,c;if(t===X)return t;let r=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const o=yt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((c=r==null?void 0:r._$AO)==null||c.call(r,!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=tt(i,r._$AS(i,t.values),r,s)),t}class Ai{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??z).importNode(e,!0);L.currentNode=r;let o=L.nextNode(),n=0,c=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new At(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new ki(o,this,t)),this._$AV.push(d),a=s[++c]}n!==(a==null?void 0:a.index)&&(o=L.nextNode(),n++)}return L.currentNode=z,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class At{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),yt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):$i(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=vt.createElement(zs(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(e);else{const n=new Ai(r,this),c=n.u(this.options);n.p(e),this.T(c),this._$AH=n}}_$AC(t){let e=ts.get(t.strings);return e===void 0&&ts.set(t.strings,e=new vt(t)),e}k(t){ge(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new At(this.O(gt()),this.O(gt()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=tt(this,t,e,0),n=!yt(t)||t!==this._$AH&&t!==X,n&&(this._$AH=t);else{const c=t;let a,d;for(t=o[0],a=0;a<o.length-1;a++)d=tt(this,c[s+a],e,a),d===X&&(d=this._$AH[a]),n||(n=!yt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class xi extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Ei extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Si extends Dt{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??b)===X)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ki{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const Jt=dt.litHtmlPolyfillSupport;Jt==null||Jt(vt,At),(dt.litHtmlVersions??(dt.litHtmlVersions=[])).push("3.2.1");const Pi=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new At(t.insertBefore(gt(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let O=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Pi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return X}};var es;O._$litElement$=!0,O.finalized=!0,(es=globalThis.litElementHydrateSupport)==null||es.call(globalThis,{LitElement:O});const Zt=globalThis.litElementPolyfillSupport;Zt==null||Zt({LitElement:O});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const ye=class ye extends O{render(){return y`
            <header class="header_layout">
                <h1>Grocery Guru</h1>
                <nav class="nav_links">
                    <a href="../app">Home</a>
                    <a href="../app/recipe-search-view">Recipes Search</a>
                    <a href="../app/about-view">About</a>
                </nav>
                <div class="action-container">
                    <div class="dark-mode-container">
                        <label>
                            <input
                                    type="checkbox"
                                    autocomplete="off"
                                    class="dark-mode-switch"
                                    id="dark-mode-checkbox"
                                    @change="${this.toggleDarkMode}"
                            />
                            Dark mode
                        </label>
                    </div>
                    <div class="login">
                        <a href="../app/login">Login</a>
                    </div>
                </div>
            </header>
        `}toggleDarkMode(t){const e=t.target.checked;document.body.classList.toggle("dark-mode",e)}};ye.styles=rt`
        :host {
            display: contents;
        }
        .header_layout {
            background-color: var(--color-background-header);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
        }

        .header_layout h1 {
            color: var(--color-title);
            margin-right: auto;
        }

        .header_layout .nav_links {
            display: flex;
            gap: 80px; /* Space between navigation links */
            margin-right: auto;
            margin-left: 40px;
        }

        .header_layout .nav_links a {
            color: black;
            text-decoration: none;
            transition: color 0.3s ease, transform 0.3s ease;
        }

        .header_layout .nav_links a:hover {
            color: white;
            transform: scale(1.05);
        }

        .action-container {
            display: flex;
            align-items: center;
            gap: 20px; /* Add spacing between dark mode and login */
        }

        .dark-mode-container {
            display: flex;
            align-items: center;
            gap: 10px; /* Space between label and checkbox */
        }

        .login a {
            color: black;
            text-decoration: none;
            transition: color 0.3s ease, transform 0.3s ease;
        }

        .login a:hover {
            color: white;
            transform: scale(1.05);
        }

        #dark-mode-checkbox {
            margin-left: 5px;
        }
    `;let Mt=ye;st({"all-header":Mt,"mu-auth":Lt.Provider});window.relayEvent=ar.relay;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ci={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:me},Ti=(i=Ci,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i)},init(c){return c!==void 0&&this.P(n,void 0,i),c}}}if(s==="setter"){const{name:n}=e;return function(c){const a=this[n];t.call(this,c),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function Ds(i){return(t,e)=>typeof e=="object"?Ti(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function k(i){return Ds({...i,state:!0,attribute:!1})}var Oi=Object.defineProperty,Ri=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Oi(t,e,r),r};const ve=class ve extends zt{constructor(){super("guru:model"),this.searchQuery=""}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["vendors/load"])}handleSearch(){const t=this.searchQuery.toLowerCase();this.dispatchMessage(["search/item",{query:t}]),this.searchQuery=""}handleRemove(t){this.dispatchMessage(["cart/removeItem",{itemId:t}])}render(){const{cartItems:t=[],totalCost:e=0}=this.model;return y`
            <main>
                <section class="search-section">
                    <h2>Search for Items</h2>
                    <div class="search-bar">
                        <input
                                type="text"
                                id="item-name"
                                placeholder="Enter item name..."
                                .value="${this.searchQuery}"
                                @input="${s=>this.searchQuery=s.target.value}"
                        />
                        <button @click="${this.handleSearch}">Add to Cart</button>
                    </div>
                </section>

                <section class="cart-section">
                    <h2>Your Cart</h2>
                    <div class="cart-summary">
                        <p>Total Items: ${t.length}</p>
                        <p>Estimated Total: $${e.toFixed(2)}</p>
                    </div>
                    <ul class="cart-items">
                        ${t.map(s=>y`
                                            <li class="cart-item">
                                                <span>${s.name} (Vendor: ${s.vendorName}): $${s.price.toFixed(2)}</span>
                                                <button
                                                        class="remove-btn"
                                                        @click="${()=>this.handleRemove(s.id)}"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        `)}
                    </ul>
                </section>
            </main>
        `}};ve.styles=rt`
        /* General Styling */
        main {
            padding: 20px;
            font-family: 'Arial', sans-serif;
        }

        /* Search Section Styling */
        .search-section {
            margin-bottom: 20px;
        }

        .search-bar {
            display: flex;
        }

        input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-right: none;
            border-top-left-radius: 25px;
            border-bottom-left-radius: 25px;
            outline: none;
        }

        button {
            padding: 10px 20px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-left: none;
            border-top-right-radius: 25px;
            border-bottom-right-radius: 25px;
            background-color: var(--button-bg, black);
            color: var(--button-text, white);
            transition: background-color 0.3s ease; /* Smooth hover effect */
        }

        button:hover {
            background-color: var(--button-hover-bg, grey);
        }

        /* Cart Section Styling */
        .cart-section {
            margin-top: 20px;
        }

        .cart-items {
            list-style-type: none;
            padding: 0;
            margin: 10px 0;
        }

        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
        }

        .remove-btn {
            background-color: red;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .remove-btn:hover {
            background-color: darkred;
        }

        /* Dark Mode Placeholder */
        :host([theme="dark"]) {
            --button-bg: #333;
            --button-hover-bg: #555;
            --button-text: white;
        }
    `;let _t=ve;Ri([k()],_t.prototype,"searchQuery");st({"home-view":_t});var Ui=Object.defineProperty,Fs=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Ui(t,e,r),r};const _e=class _e extends O{constructor(){super(...arguments),this.itemId="",this.recipe=null}connectedCallback(){super.connectedCallback(),console.log("ConnectedCallback -> Item ID:",this.itemId),this.itemId?this.hydrate():console.error("Missing itemId for recipe.")}hydrate(){console.log("Fetching recipe with ID:",this.itemId),fetch(`/api/recipes/${this.itemId}`).then(t=>{if(t.ok)return t.json();throw new Error(`Error fetching recipe: ${t.statusText}`)}).then(t=>{this.recipe={...t,ingredients:t.ingredients||[],instructions:t.instructions||[]}}).catch(t=>{console.error("Failed to fetch recipe:",t)})}render(){if(!this.recipe)return y`<p>Loading recipe...</p>`;const{name:t,servings:e,prepTime:s,ingredients:r,instructions:o,notes:n}=this.recipe;return y`
      <main>
        <section class="recipe-section">
          <h2>${t}</h2>
          <p>Store: ${this.recipe.store}</p>
          <p>Servings: ${e}</p>
          <p>Prep Time: ${s}</p>

          <div class="ingredients">
            <h3>Ingredients</h3>
            <ul>
              ${r.map(c=>y`
                <li>${c.quantity} ${c.unit} ${c.itemName}</li>
              `)}
            </ul>
          </div>

          <div class="instructions">
            <h3>Instructions</h3>
            <ol>
              ${o.map(c=>y`<li>${c}</li>`)}
            </ol>
          </div>

          <div class="notes">
            <h3>Notes</h3>
            <p>${n||"No additional notes"}</p>
          </div>
        </section>
      </main>
    `}};_e.styles=rt`
      main {
        padding: 20px;
      }

      .recipe-section {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      h2 {
        font-size: var(--size-type-xxlarge);
        font-family: var(--font-family-header);
        text-align: center;
      }

      .ingredients, .instructions, .notes {
        margin-top: 20px;
      }

      .ingredients ul, .instructions ol {
        padding-left: 20px;
        line-height: 1.6;
      }

      .notes p {
        font-style: italic;
      }
    `;let et=_e;Fs([Ds({type:String})],et.prototype,"itemId");Fs([k()],et.prototype,"recipe");var Ni=Object.defineProperty,it=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Ni(t,e,r),r};const $e=class $e extends O{constructor(){super(...arguments),this.username="",this.password="",this.confirmPassword="",this.errorMessage="",this.successMessage="",this.isRegister=!1}handleLogin(){console.log("Attempting login with:",{username:this.username}),fetch("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)console.log("Login successful!"),window.location.href="/app";else throw new Error("Invalid username or password")}).catch(t=>{console.error("Login failed:",t),this.errorMessage="Invalid username or password. Please try again."})}handleRegister(){if(console.log("Attempting registration with:",{username:this.username,password:this.password,confirmPassword:this.confirmPassword}),this.password!==this.confirmPassword){this.errorMessage="Passwords do not match!";return}fetch("/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)console.log("Registration successful!"),this.successMessage="Registration successful! You can now log in.",this.isRegister=!1,this.errorMessage="";else return t.json().then(e=>{throw new Error(e.message||"Registration failed")})}).catch(t=>{console.error("Registration failed:",t),this.errorMessage=t.message||"Registration failed. Please try again."})}toggleView(){this.isRegister=!this.isRegister,this.errorMessage="",this.successMessage="",this.username="",this.password="",this.confirmPassword=""}render(){return y`
        <main class="page">
            <section>
                <h3>${this.isRegister?"Register":"Log in"}</h3>
                ${this.errorMessage?y`<p class="error-message">${this.errorMessage}</p>`:""}
                ${this.successMessage?y`<p class="success-message">${this.successMessage}</p>`:""}

                <form @submit="${t=>t.preventDefault()}">
                    <div>
                        <label for="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            .value="${this.username}"
                            @input="${t=>this.username=t.target.value}"
                        />
                    </div>
                    <div>
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            .value="${this.password}"
                            @input="${t=>this.password=t.target.value}"
                        />
                    </div>

                    ${this.isRegister?y`
                            <div>
                                <label for="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    .value="${this.confirmPassword}"
                                    @input="${t=>this.confirmPassword=t.target.value}"
                                />
                            </div>
                          `:""}

                    <button @click="${this.isRegister?this.handleRegister:this.handleLogin}">
                        ${this.isRegister?"Register":"Login"}
                    </button>
                </form>

                <p>
                    ${this.isRegister?y`
                            Already have an account?
                            <a @click="${this.toggleView}" href="javascript:void(0)">Login</a>
                          `:y`
                            Don't have an account?
                            <a @click="${this.toggleView}" href="javascript:void(0)">Register</a>
                          `}
                </p>
            </section>
        </main>
      `}};$e.styles=rt`
      main.page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: var(--color-background);
      }

      section {
          
        max-width: 400px;
        width: 100%;
        background-color: var(--color-background-card);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #ccc;
      }

      h3 {
        text-align: center;
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }

        input {
            width: calc(100% - 20px); /* Adjust width to account for padding */
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box; /* Ensure padding and border are included in the width */
        }


        button {
            width: 100%;
            padding: 10px;
            background-color: var(--color-primary);
            color: var(--color-text-light);
            font-size: var(--size-type-medium);
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid #ccc;
            transition: background-color 0.3s ease; /* Smooth hover effect */

        }

        button:hover {
            background-color: var(--button-hover-bg, grey);
        }

      p {
        text-align: center;
        margin-top: 15px;
      }

      .error-message {
        color: var(--color-error);
        text-align: center;
        margin-bottom: 10px;
      }

      .success-message {
        color: var(--color-success);
        text-align: center;
        margin-bottom: 10px;
      }
    `;let S=$e;it([k()],S.prototype,"username");it([k()],S.prototype,"password");it([k()],S.prototype,"confirmPassword");it([k()],S.prototype,"errorMessage");it([k()],S.prototype,"successMessage");it([k()],S.prototype,"isRegister");var Mi=Object.defineProperty,Ii=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Mi(t,e,r),r};const be=class be extends zt{constructor(){super("guru:model"),this.searchQuery=""}handleSearch(){const t=this.searchQuery.toLowerCase();this.dispatchMessage(["recipes/search",{query:t}]),this.searchQuery=""}render(){const{recipes:t=[]}=this.model;return y`
      <main>
        <section class="search-section">
          <h2>Search for Recipes</h2>
          <div class="search-bar">
            <input
              type="text"
              id="recipe-keyword"
              placeholder="Enter recipe keyword..."
              .value="${this.searchQuery}"
              @input="${e=>this.searchQuery=e.target.value}"
            />
            <button @click="${this.handleSearch}">Search</button>
          </div>
        </section>

        <section class="results-section">
          <h2>Search Results</h2>
          ${t.length===0?y`<p>No recipes found.</p>`:y`
                <ul class="recipe-list">
                  ${t.map(e=>y`
                        <li>
                          <a href="recipes/${e.id}">${e.name}</a>
                        </li>
                      `)}
                </ul>
              `}
        </section>
      </main>
    `}};be.styles=rt`
        main {
            padding: 20px;
        }

        .search-section {
            margin-bottom: 20px;
        }

        .search-bar {
            display: flex;
        }

        input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-right: none;
            border-top-left-radius: 25px;
            border-bottom-left-radius: 25px;
            outline: none;
        }

        button {
            padding: 10px 20px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-left: none;
            border-top-right-radius: 25px;
            border-bottom-right-radius: 25px;
            background-color: black;
            color: white;
            transition: background-color 0.3s ease; /* Add this line */
        }

        button:hover {
            background-color: grey;
        }


        .results-section {
            margin-top: 20px;
        }

        .recipe-list {
            list-style-type: none;
            padding: 0;
            margin: 10px 0;
        }

        .recipe-list li {
            padding: 10px;
            margin-bottom: 5px;
            border: 1px solid #ccc;
            border-radius: 10px; /* Rounded corners */
            background-color: #f9f9f9; /* Subtle background color */
            cursor: pointer; /* Pointer cursor to indicate clickability */
            transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth hover effects */
        }

        .recipe-list li:hover {
            background-color: #e0e0e0; /* Slightly darker background on hover */
            transform: scale(1.02); /* Subtle zoom-in effect */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add a shadow for emphasis */
        }

        .recipe-list a {
            text-decoration: none;
            color: black; /* Default color for unvisited links */
            font-weight: bold; /* Make the link text stand out */
            transition: color 0.3s ease; /* Smooth transition for color change */
        }

        .recipe-list a:visited {
            color: purple; /* Change color for visited links */
        }

    `;let $t=be;Ii([k()],$t.prototype,"searchQuery");st({"recipe-search-view":$t});const we=class we extends zt{constructor(){super("guru:model")}render(){return y`
      <main>
        <section class="about-section">
          <div class="about-content">
            <h1>About Grocery Guru</h1>
            <p>
              Grocery Guru is dedicated to tackling food waste and helping families save money. We aggregate grocery prices from a wide range of stores, allowing users to compare and find the best deals. By encouraging stores to sell near-expiry items, we play a crucial role in reducing food waste while making shopping more affordable.
            </p>
          </div>
        </section>
      </main>
    `}};we.styles=rt`
    header.header_layout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      background-color: #f8f8f8;
    }

    header h1 {
      margin: 0;
    }

    .nav_links {
      display: flex;
      gap: 15px;
    }

    .nav_links a {
      text-decoration: none;
      color: #333;
      font-weight: bold;
    }

    .login a {
      text-decoration: none;
      color: #333;
    }

    main {
      padding: 20px;
    }

    .about-section {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 40px 0;
    }

    .about-content {
      flex: 1;
      padding-right: 20px;
    }

    .about-content h1 {
      font-size: 2.5em;
      margin-bottom: 20px;
    }

    .about-content p {
      font-size: 1.2em;
      line-height: 1.6;
    }

    .about-image {
      flex: 1;
      text-align: center;
    }

    .about-image img {
      max-width: 100%;
      height: auto;
    }
  `;let It=we;st({"about-view":It});const Li={vendors:[],cartItems:[],totalCost:0,recipes:[]};function qs(i,t,e){switch(i[0]){case"vendors/load":Hi(e).then(n=>t(c=>({...c,vendors:n}))).catch(n=>{console.error("Failed to fetch vendors:",n)});break;case"search/item":const{query:s}=i[1];t(n=>{const c=s.toLowerCase();let a=null;return n.vendors.forEach(d=>{d.items.forEach(p=>{p.name.toLowerCase().includes(c)&&(!a||p.price<a.price)&&(a={id:p.id,name:p.name,price:p.price,vendorName:d.name})})}),a!==null?{...n,cartItems:[...n.cartItems,a],totalCost:n.totalCost+a.price}:(console.warn(`No items found for query: ${s}`),n)});break;case"recipes/search":ji(i[1].query,t,e);break;case"cart/add":t(n=>({...n,cartItems:[...n.cartItems,i[1].item],totalCost:n.totalCost+i[1].item.price}));break;case"cart/removeItem":const{itemId:r}=i[1];t(n=>{const c=n.cartItems.findIndex(a=>a.id===r);if(c!==-1){const a=[...n.cartItems],[d]=a.splice(c,1),p=n.totalCost-d.price*(d.quantity||1);return{...n,cartItems:a,totalCost:p}}return n});break;default:const o=i[0];throw new Error(`Unhandled Auth message "${o}"`)}}function ji(i,t,e){zi(e).then(s=>{const r=i.toLowerCase(),o=s.filter(n=>n.name.toLowerCase().includes(r));t(n=>({...n,recipes:o}))}).catch(s=>{console.error("Failed to fetch recipes:",s)})}function Hi(i){return fetch("/api/vendors",{headers:Lt.headers(i)}).then(t=>{if(!t.ok)throw t.status===401?new Error("Unauthorized: User must log in."):new Error(`API error: ${t.statusText}`);return t.json()}).then(t=>{if(Array.isArray(t))return t;throw new Error("Unexpected response format")})}function zi(i){return fetch("/api/recipes",{headers:Lt.headers(i)}).then(t=>{if(!t.ok)throw t.status===401?new Error("Unauthorized: User must log in."):new Error(`API error: ${t.statusText}`);return t.json()}).then(t=>{if(Array.isArray(t))return t;throw new Error("Unexpected response format")})}const Ae=class Ae extends O{render(){return y`
            <mu-switch></mu-switch>`}connectedCallback(){super.connectedCallback()}};Ae.uses=st({"home-view":_t,"recipe-view":et,"login-view":S,"recipe-search-view":$t,"about-view":It,"mu-store":class extends ys.Provider{constructor(){super(qs,Li,"guru:auth")}}});let ie=Ae;const Di=[{path:"/app/recipes/:id",view:i=>y`
            <recipe-view itemId="${i.id}"></recipe-view>
        `},{path:"/app/login",view:()=>y`
            <login-view></login-view>`},{path:"/app/recipe-search-view",view:()=>y`
            <recipe-search-view></recipe-search-view>
        `},{path:"/app/about-view",view:()=>y`
            <about-view></about-view>
        `},{path:"/app",view:()=>y`
            <home-view></home-view>
        `},{path:"/",redirect:"/app"}];st({"mu-auth":Lt.Provider,"mu-history":pr.Provider,"mu-store":class extends ys.Provider{constructor(){super(qs,{cartItems:[],vendors:[],totalCost:0,recipes:[]},"guru:auth")}},"mu-switch":class extends ii.Element{constructor(){super(Di,"guru:history","guru:auth")}},"grocery-guru-app":ie,"all-header":Mt,"recipe-view":et});
