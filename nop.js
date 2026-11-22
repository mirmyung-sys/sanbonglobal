/* 산본글로벌어학원 — 홈페이지 가격·결제 내림 (2026-11-22 대표님 「가격은 전부 내리자 · 결제도 하지 말고」)
   + 시간표 내림 (2026-11-22 20:49 대표님 「스파르타 시간도 빼 … 그냥 다 빼 시간표」) — 수업 운영시간(평일 06:30~22:00 등)은 남김 */
(function(){
var MSG='상담 시 안내';
var RE=[/(개월\s*|월\s*|1인당\s*월\s*|시간당\s*)?[0-9]{1,3}(,[0-9]{3})+\s*원(대|꼴)?/g,/(개월\s*|월\s*)?[0-9]+(\.[0-9]+)?\s*만\s*([0-9,]+\s*)?원(대|꼴)?/g];
function rp(m){return /^개월/.test(m)?'개월 '+MSG:MSG}
var D='(월|화|수|목|금|토|일)(요일)?';
var TM=new RegExp('('+D+'(\\s*[·~,/\\-]\\s*'+D+')*\\s*(매일\\s*)?)?((오전|오후|저녁|낮|밤)\\s*)?([01]?[0-9]|2[0-3]):[0-5][0-9](\\s*[~\\-–]\\s*([01]?[0-9]|2[0-3]):[0-5][0-9])?(\\s*\\(\\s*[0-9]+분\\s*\\))?','g');
var DAYONLY=new RegExp('^\\s*'+D+'(\\s*[·~,/\\-]\\s*'+D+')*\\s*$');
var HOURS=/수업\s*평일|데스크|운영\s*시간|휴무|첫 수업/;
var TXT=[[/\s*·\s*시간표는 강의관에서 확인/g,''],[/강사·시간표/g,'강사'],[/과목별 담당 강사와 개강 시간표를/g,'과목별 담당 강사를'],[/\s*\(일부 시간표는 준비중입니다\)/g,''],[/\s*—\s*개설 시간표/g,' — 개설반'],[/개설 시간표 \(현재 개강반\)/g,'현재 개강반']];
var TTLINK=/시간표\s*(보기|열기)|^\s*전체\s*시간표\s*$|^\s*강의시간표\s*$|^\s*전체\s*시간표\s*›?\s*$/;
var SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,INPUT:1,SELECT:1,OPTION:1,NOSCRIPT:1};
function fix(node){
 if(node.nodeType===3){var v=node.nodeValue,o=v;TXT.forEach(function(t){v=v.replace(t[0],t[1])});var pe=node.parentNode;if(pe&&pe.closest&&pe.closest('[data-nop-keep]'))return;if(DAYONLY.test(v)&&pe&&pe.childNodes.length===1&&/^(TD|SPAN|B|DIV|LI|EM|I|SMALL|STRONG)$/.test(pe.tagName)){node.nodeValue='';return}if(!/[0-9]/.test(v)){if(v!==o)node.nodeValue=v;return}RE.forEach(function(r){v=v.replace(r,rp)});var hb=pe&&pe.parentNode?(pe.textContent+' '+(pe.parentNode.textContent||'').slice(0,400)):'';if(!HOURS.test(hb))v=v.replace(TM,MSG);
  var tail=/([0-9]{1,3}(,[0-9]{3})+|[0-9]+\s*만)\s*$/;if(tail.test(v)){var nx=node.nextSibling,pn=null;if(!nx&&node.parentNode&&node.parentNode!==document.body){pn=node.parentNode.nextSibling}var tg=nx||pn;if(tg&&/^\s*원/.test(tg.textContent||'')){v=v.replace(tail,MSG);if(tg.nodeType===3)tg.nodeValue=tg.nodeValue.replace(/^\s*원(대|꼴)?/,'');else if(tg.firstChild&&tg.firstChild.nodeType===3)tg.firstChild.nodeValue=tg.firstChild.nodeValue.replace(/^\s*원(대|꼴)?/,'');else tg.textContent=tg.textContent.replace(/^\s*원(대|꼴)?/,'')}}
  v=v.replace(new RegExp('('+MSG+')(\\s*(→|->|~|/|·|,|\\||와|과)?\\s*'+MSG+')+','g'),MSG);if(v!==o)node.nodeValue=v;return}
 if(node.nodeType!==1||SKIP[node.tagName])return;
 if((node.tagName==='A'||node.tagName==='BUTTON')){var oc=node.getAttribute('onclick')||'';if(/openTT\(|전체시간표/.test(oc)||TTLINK.test(node.textContent)){node.style.display='none';return}}
 if((node.tagName==='S'||node.tagName==='DEL'||node.tagName==='STRIKE')&&/[0-9],[0-9]{3}|만/.test(node.textContent)){node.style.display='none';return}
 for(var c=node.firstChild;c;c=c.nextSibling)fix(c)}
function consult(){try{if(typeof window.rsvOpen==='function'){window.rsvOpen();return}}catch(e){}location.href='tel:0314666969'}
var BUY=['wkBuy','spPay','spOpenPay','spBuyItem','spBuyAmt','spBuy','persBuy','openBuy','oneBuy','dgPay','cartGo','cartAdd','btBuy','aiSoloBuy','aiBuy','sgaKorpay','sgaPayReady'];
function lock(){if(typeof window.openTT==='function'&&!window.openTT.__nop){var t=function(){consult();return false};t.__nop=1;window.openTT=t}if(typeof window.openPage==='function'&&!window.openPage.__nop){var op=window.openPage;var w=function(k){if(/시간표/.test(String(k)))return consult();return op.apply(this,arguments)};w.__nop=1;window.openPage=w}BUY.forEach(function(n){if(typeof window[n]==='function'&&!window[n].__nop){var f=function(){consult();return false};f.__nop=1;window[n]=f}})}
function run(){lock();fix(document.body);var t=document.title;if(/[0-9],[0-9]{3}\s*원/.test(t))document.title=t.replace(RE[0],rp)}
var busy=false;
function start(){run();new MutationObserver(function(ms){if(busy)return;busy=true;ms.forEach(function(m){if(m.type==='characterData')fix(m.target);else m.addedNodes.forEach(fix)});lock();busy=false}).observe(document.body,{childList:true,subtree:true,characterData:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.addEventListener('load',run);
})();
