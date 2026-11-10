/* 글루테크 공통: 머리글·바닥글·견적함 */
(function(){
const LOGO='<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="none" stroke="#C8A96A" stroke-width="1.5"/><path d="M20 8c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z" fill="#C8A96A"/><path d="M20 17c2.5 3.5 4 5.6 4 7.4a4 4 0 0 1-8 0c0-1.8 1.5-3.9 4-7.4z" fill="#6A4BA0"/></svg>';
const TEL='010-4855-9734';
/* 시안: 채널 주소가 정해지면 여기만 바꾼다 */
const SNS={yt:'https://www.youtube.com/@gluetech',ig:'https://www.instagram.com/gluetech.kr/',sh:'https://www.youtube.com/@gluetech/shorts',kk:'https://pf.kakao.com/_gluetech'};
const NAV=[
 ['회사소개','company.html',[['인사말','company.html#greet'],['회사 개요','company.html#overview'],['오시는 길','company.html#location']]],
 ['제품소개','product.html',[['탱크','product.html?c=tank'],['히팅호스','product.html?c=hose'],['노즐','product.html?c=nozzle'],['모듈','product.html?c=module'],['오토건','product.html?c=gun']]],
 ['정보','info.html',[['핫멜트 소개','info.html#hotmelt'],['어플리케이터','info.html#applicator'],['노즐 고르기','info.html#nozzle'],['작동 영상','info.html#video']]],
 ['적용분야','application.html',[]]];
const hdSlot=document.getElementById('hd-slot');
if(hdSlot){hdSlot.outerHTML=`<header class="hd" id="hd"><div class="bar">
 <a class="brand" href="index.html" aria-label="글루테크 처음으로">${LOGO}<span><b>GLUE TECH</b><small>글루테크 · 핫멜트 어플리케이터 제조</small></span></a>
 <ul class="gnb">${NAV.map(n=>`<li><a href="${n[1]}">${n[0]}</a>${n[2].length?`<div class="sub">${n[2].map(s=>`<a href="${s[1]}">${s[0]}</a>`).join('')}</div>`:''}</li>`).join('')}</ul>
 <a class="tel" href="tel:${TEL.replace(/-/g,'')}">${TEL}</a>
 <a class="qbtn" href="quote.html">견적함 <span class="qn" id="qn">0</span></a>
 <button class="burger" aria-label="메뉴 열기" aria-expanded="false"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
</div></header>`}
const ftSlot=document.getElementById('ft-slot');
if(ftSlot){ftSlot.outerHTML=`<footer><div class="w">
 <div><a class="brand" href="index.html">${LOGO.replace('<svg','<svg style="width:30px;height:30px"')}<span><b>GLUE TECH</b></span></a><p style="margin-top:12px">핫멜트 어플리케이터 제조 · 설치 · A/S</p></div>
 <div><b>회사 정보</b><br>상호 글루테크 · 대표 주동근<br>사업자등록번호 293-79-00501<br>경상남도 김해시 분성로 680(지내동)<br>업태 제조업 · 일반목적용 기계 제조</div>
 <div><b>고객센터</b><br>대표 주동근 · 전화 <a href="tel:${TEL.replace(/-/g,'')}" style="color:inherit">${TEL}</a><br>이메일 sales@gluetech.co.kr · 평일 09:00 ~ 18:00<br>www.gluetech.co.kr
 <div class="sns"><a href="${SNS.yt}" data-soon target="_blank" rel="noopener">▶ 유튜브</a><a href="${SNS.ig}" data-soon target="_blank" rel="noopener">◎ 릴스</a><a href="${SNS.sh}" data-soon target="_blank" rel="noopener">▶ 쇼츠</a><a class="k" href="${SNS.kk}" data-soon target="_blank" rel="noopener">💬 카카오톡</a></div></div>
</div></footer>`}
const hd=document.getElementById('hd');
if(hd){
 const b=hd.querySelector('.burger');b.addEventListener('click',()=>{const o=hd.classList.toggle('open');b.setAttribute('aria-expanded',o)});
 const solidAlways=document.body.dataset.solid==='1';
 const f=()=>hd.classList.toggle('solid',solidAlways||scrollY>(document.body.dataset.solidAt?+document.body.dataset.solidAt:innerHeight*.6));
 addEventListener('scroll',f,{passive:true});f();
 const here=location.pathname.split('/').pop()||'index.html';
 hd.querySelectorAll('.gnb>li>a').forEach(a=>{if(a.getAttribute('href')===here)a.classList.add('cur')});
}
/* 견적함 */
const K='gt_quote';
function load(){try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return {}}}
function save(q){try{localStorage.setItem(K,JSON.stringify(q))}catch(e){}window.GT._q=q;badge()}
function badge(){const n=Object.values(window.GT._q).reduce((s,v)=>s+v.q,0);const el=document.getElementById('qn');if(el){el.textContent=n;el.style.display=n?'inline-grid':'none'}}
window.GT={_q:load(),
 add(code,name){const q=this._q;q[code]=q[code]||{n:name,q:0};q[code].q++;save(q);toast(name+' — 견적함에 담았습니다')},
 set(code,v){const q=this._q;if(!q[code])return;q[code].q=Math.max(1,Math.min(999,parseInt(v)||1));save(q)},
 del(code){const q=this._q;delete q[code];save(q)},
 clear(){save({})},list(){return Object.entries(this._q)}};
function toast(t){let el=document.getElementById('toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';el.setAttribute('role','status');document.body.appendChild(el)}
 el.innerHTML=`<span>${t}</span>`+(/견적함/.test(t)?'<a href="quote.html">견적함 보기</a>':'');el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2600)}

/* 카톡 떠있는 버튼 */
document.body.insertAdjacentHTML('beforeend',`<a class="kfab" href="${SNS.kk}" data-soon target="_blank" rel="noopener" aria-label="카카오톡 상담">💬<br>카톡</a>`);
/* 표시창 — 처음 화면에서만 */
if(document.body.dataset.pop==='1'){
 const G='https://d8j0ntlcm91z4.cloudfront.net/user_3GADcyKE4Ow4Cld3tfs2MW9GGPk/hf_20261105_091935_0e48c264-612f-4e31-973a-ea9bbf8499b2.mp4',S='https://d8j0ntlcm91z4.cloudfront.net/user_3GADcyKE4Ow4Cld3tfs2MW9GGPk/hf_20261105_092431_dcd20494-91ee-4056-b769-3bbae95320e5.mp4';
 const T={yt:{w:1,src:['img/gt_journey.mp4','https://d8j0ntlcm91z4.cloudfront.net/user_3GADcyKE4Ow4Cld3tfs2MW9GGPk/hf_20261106_155452_1116cdb0-b4fe-433a-94e6-481c917c4a6e.mp4','img/machine.mp4'],po:'img/machine_poster.jpg',tag:'유튜브 · 알갱이에서 노즐까지',go:'유튜브 채널에서 전체 영상 보기',href:SNS.yt},
  ig:{src:['img/gt_spiral_ma002.mp4',S],po:'img/spiral_poster.jpg',tag:'릴스 · MA002 Spiral 분사',go:'인스타그램 릴스 보기',href:SNS.ig},
  sh:{src:['img/gt_gun_nozzle.mp4',G],po:'img/gun_poster.jpg',tag:'쇼츠 · 오토건 + S 노즐',go:'유튜브 쇼츠 보기',href:SNS.sh},
  kk:{kk:1,go:'카카오톡으로 견적 상담하기',href:SNS.kk}};
 let hide=0;try{hide=localStorage.getItem('gt_pop_off')===new Date().toDateString()}catch(e){}
 if(!hide){
  document.body.insertAdjacentHTML('beforeend',`<div id="gtPop" role="dialog" aria-modal="true" aria-label="글루테크 소식"><div class="pm-box">
  <div class="pm-tabs"><button data-k="yt">유튜브</button><button data-k="ig">릴스</button><button data-k="sh">쇼츠</button><button data-k="kk">카카오톡</button></div>
  <div class="pm-v"><video muted loop playsinline autoplay></video><span class="pm-tag"></span></div>
  <div class="pm-kakao"><b>글루테크 카카오톡</b><div class="qr">카카오톡에서<br>「글루테크」 검색</div><div>모델명·수량·라인 조건을 보내 주시면<br>바로 견적을 드립니다.</div><div style="font-weight:800">전화 ${TEL}</div></div>
  <a class="pm-go" href="#" target="_blank" rel="noopener"></a><button class="pm-off" type="button">오늘 하루 안 보기</button></div></div>
  <button id="gtPopX" type="button">✕ 닫기</button>`);
  const P=document.getElementById('gtPop'),V=P.querySelector('video'),go=P.querySelector('.pm-go');
  const show=k=>{const o=T[k];P.querySelectorAll('.pm-tabs button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));P.classList.toggle('wide',!!o.w);P.classList.toggle('kk',!!o.kk);
   go.textContent=o.go;go.href=o.href;
   if(!o.kk){V.innerHTML=o.src.map(s=>`<source src="${s}" type="video/mp4">`).join('');V.poster=o.po;P.querySelector('.pm-tag').textContent=o.tag;V.load();V.play().catch(()=>{})}else V.pause()};
  P.querySelectorAll('.pm-tabs button').forEach(b=>b.onclick=()=>show(b.dataset.k));
  const close=()=>{P.classList.remove('on');V.pause()};
  document.getElementById('gtPopX').onclick=close;P.onclick=e=>{if(e.target===P)close()};
  P.querySelector('.pm-off').onclick=()=>{try{localStorage.setItem('gt_pop_off',new Date().toDateString())}catch(e){}close()};
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  show('sh');P.classList.add('on');
 }
}
/* 시안 링크 안내 */
document.addEventListener('click',e=>{const a=e.target.closest('a[data-soon]');if(a&&a.getAttribute('href').startsWith('#')){e.preventDefault();toast('시안입니다 — 채널 주소를 받으면 연결합니다')}});
badge();
/* 등장 */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
})();
