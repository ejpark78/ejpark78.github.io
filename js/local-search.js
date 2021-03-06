/* global CONFIG */
document.addEventListener("DOMContentLoaded",()=>{if(!CONFIG.path)return void console.warn("`hexo-generator-searchdb` plugin is not installed!");
// Popup Window
let e,t=!1;const n=document.querySelector(".search-input"),o=(e,t,n=!1)=>{const o=[],r=new Set;return e.forEach(e=>{if(CONFIG.localsearch.unescape){const t=document.createElement("div");t.innerText=e,e=t.innerHTML}const s=e.length;if(0===s)return;let c=0,i=-1;for(n||(t=t.toLowerCase(),e=e.toLowerCase());(i=t.indexOf(e,c))>-1;)o.push({position:i,word:e}),r.add(e),c=i+s}),
// Sort index by position of keyword
o.sort((e,t)=>e.position!==t.position?e.position-t.position:t.word.length-e.word.length),[o,r]},r=(e,t,n)=>{let o=n[0],{position:r,word:s}=o;const c=[],i=new Set;for(;r+s.length<=t&&0!==n.length;){i.add(s),c.push({position:r,length:s.length});const e=r+s.length;
// Move to next position of hit
for(n.shift();0!==n.length&&(o=n[0],r=o.position,s=o.word,e>r);)n.shift()}return{hits:c,start:e,end:t,count:i.size}},s=(e,t)=>{let n="",o=t.start;for(const{position:r,length:s}of t.hits)n+=e.substring(o,r),o=r+s,n+=`<mark class="search-keyword">${e.substr(r,s)}</mark>`;return n+=e.substring(o,t.end),n},c=()=>{if(!t)return;const c=n.value.trim().toLowerCase(),i=c.split(/[-\s]+/),l=document.querySelector(".search-result-container");let a=[];c.length>0&&(
// Perform local searching
a=(t=>{const n=[];return e.forEach(({title:e,content:c,url:i})=>{
// The number of different keywords included in the article.
const[l,a]=o(t,e),[u,h]=o(t,c),d=new Set([...a,...h]).size,p=l.length+u.length;if(0===p)return;const g=[];0!==l.length&&g.push(r(0,e.length,l));let f=[];for(;0!==u.length;){const e=u[0],{position:t}=e,n=Math.max(0,t-20),o=Math.min(c.length,t+80);f.push(r(n,o,u))}
// Sort slices in content by included keywords' count and hits' count
f.sort((e,t)=>e.count!==t.count?t.count-e.count:e.hits.length!==t.hits.length?t.hits.length-e.hits.length:e.start-t.start);
// Select top N slices in content
const m=parseInt(CONFIG.localsearch.top_n_per_article,10);m>=0&&(f=f.slice(0,m));let C="";(i=new URL(i,location.origin)).searchParams.append("highlight",t.join(" ")),0!==g.length?C+=`<li><a href="${i.href}" class="search-result-title">${s(e,g[0])}</a>`:C+=`<li><a href="${i.href}" class="search-result-title">${e}</a>`,f.forEach(e=>{C+=`<a href="${i.href}"><p class="search-result">${s(c,e)}...</p></a>`}),C+="</li>",n.push({item:C,id:n.length,hitCount:p,includedCount:d})}),n})(i)),1===i.length&&""===i[0]?l.innerHTML='<div class="no-result"><i class="fa fa-search fa-5x"></i></div>':0===a.length?l.innerHTML='<div class="no-result"><i class="far fa-frown fa-5x"></i></div>':(a.sort((e,t)=>e.includedCount!==t.includedCount?t.includedCount-e.includedCount:e.hitCount!==t.hitCount?t.hitCount-e.hitCount:t.id-e.id),l.innerHTML=`<ul class="search-result-list">${a.map(e=>e.item).join("")}</ul>`,window.pjax&&window.pjax.refresh(l))},i=()=>{
// Search DB path
const n=CONFIG.root+CONFIG.path,o=!CONFIG.path.endsWith("json");fetch(n).then(e=>e.text()).then(n=>{
// Get the contents from search data
t=!0,e=o?[...(new DOMParser).parseFromString(n,"text/xml").querySelectorAll("entry")].map(e=>({title:e.querySelector("title").textContent,content:e.querySelector("content").textContent,url:e.querySelector("url").textContent})):JSON.parse(n),
// Only match articles with non-empty titles
e=e.filter(e=>e.title).map(e=>(e.title=e.title.trim(),e.content=e.content?e.content.trim().replace(/<[^>]+>/g,""):"",e.url=decodeURIComponent(e.url).replace(/\/{2,}/g,"/"),e)),
// Remove loading animation
c()})},l=()=>{const e=(()=>{const e=location.search,t=e.substr(e.indexOf("?")+1).split("&"),n={};for(const e of t){const[t,o]=e.split("=",2);t in n?n[t].push(o):n[t]=[o]}return n})(),t=e.highlight?e.highlight[0].split(/\+/).map(decodeURIComponent):[],n=document.querySelector(".post-body");if(!t.length||!n)return;const s=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,null,!1),c=[];for(;s.nextNode();)s.currentNode.parentNode.matches("button, select, textarea")||c.push(s.currentNode);c.forEach(e=>{const[n]=o(t,e.nodeValue);if(!n.length)return;((e,t,n)=>{const o=e.nodeValue;let r=t.start;const s=[];for(const{position:e,length:c}of t.hits){const t=document.createTextNode(o.substring(r,e));r=e+c;const i=document.createElement("mark");i.className=n,i.appendChild(document.createTextNode(o.substr(e,c))),s.push(t,i)}e.nodeValue=o.substring(r,t.end),s.forEach(t=>{e.parentNode.insertBefore(t,e)})})(e,r(0,e.nodeValue.length,n),"search-keyword")})};CONFIG.localsearch.preload&&i(),"auto"===CONFIG.localsearch.trigger?n.addEventListener("input",c):(document.querySelector(".search-icon").addEventListener("click",c),n.addEventListener("keypress",e=>{"Enter"===e.key&&c()})),
// Handle and trigger popup window
document.querySelectorAll(".popup-trigger").forEach(e=>{e.addEventListener("click",()=>{document.body.classList.add("search-active"),
// Wait for search-popup animation to complete
setTimeout(()=>n.focus(),500),t||i()})});
// Monitor main search box
const a=()=>{document.body.classList.remove("search-active")};document.querySelector(".search-pop-overlay").addEventListener("click",e=>{e.target===document.querySelector(".search-pop-overlay")&&a()}),document.querySelector(".popup-btn-close").addEventListener("click",a),document.addEventListener("pjax:success",()=>{l(),a()}),window.addEventListener("keyup",e=>{"Escape"===e.key&&a()})});