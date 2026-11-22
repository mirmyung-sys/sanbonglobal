/* 산본글로벌어학원 — 홈페이지 가격·결제 내림 (2026-11-22 대표님 「가격은 전부 내리자 · 결제도 하지 말고」) */
(function(){
var MSG='상담 시 안내';
var RE=[/(개월\s*|월\s*|1인당\s*월\s*|시간당\s*)?[0-9]{1,3}(,[0-9]{3})+\s*원(대|꼴)?/g,/(개월\s*|월\s*)?[0-9]+(\.[0-9]+)?\s*만\s*([0-9,]+\s*)?원(대|꼴)?/g];
function rp(m){return /^개월/.test(m)?'개월 '+MSG:MSG}
var SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,INPUT:1,SELECT:1,OPTION:1,NOSCRIPT:1};
function fix(node){
 if(node.nodeType===3){var v=node.nodeValue,o=v;if(!/[0-9]/.test(v))return;RE.forEach(function(r){v=v.replace(r,rp)});
  v=v.replace(new RegExp('('+MSG+')(\\s*(→|->|~|/|·)\\s*'+MSG+')+','g'),MSG);if(v!==o)node.nodeValue=v;return}
 if(node.nodeType!==1||SKIP[node.tagName])return;
 if((node.tagName==='S'||node.tagName==='DEL'||node.tagName==='STRIKE')&&/[0-9],[0-9]{3}|만/.test(node.textContent)){node.style.display='none';return}
 for(var c=node.firstChild;c;c=c.nextSibling)fix(c)}
function consult(){try{if(typeof window.rsvOpen==='function'){window.rsvOpen();return}}catch(e){}location.href='tel:0314666969'}
var BUY=['wkBuy','spPay','spOpenPay','spBuyItem','spBuyAmt','spBuy','persBuy','openBuy','oneBuy','dgPay','cartGo','cartAdd','btBuy','aiSoloBuy','aiBuy','sgaKorpay','sgaPayReady'];
function lock(){BUY.forEach(function(n){if(typeof window[n]==='function'&&!window[n].__nop){var f=function(){consult();return false};f.__nop=1;window[n]=f}})}
function run(){lock();fix(document.body);var t=document.title;if(/[0-9],[0-9]{3}\s*원/.test(t))document.title=t.replace(RE[0],rp)}
var busy=false;
function start(){run();new MutationObserver(function(ms){if(busy)return;busy=true;ms.forEach(function(m){if(m.type==='characterData')fix(m.target);else m.addedNodes.forEach(fix)});lock();busy=false}).observe(document.body,{childList:true,subtree:true,characterData:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.addEventListener('load',run);
})();
