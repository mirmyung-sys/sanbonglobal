/* 산본글로벌어학원 과정 안내 카드뉴스 — 2026-11-22 */
(function(){
var CSS='.gx{display:flex;flex-direction:column;gap:10px;margin-top:14px}'+
'.gx-row{background:var(--cl,#FFFAF0);border:1px solid var(--line,#EBDCC0);border-radius:14px;padding:12px 14px;font-size:14.5px;line-height:1.55}'+
'.gx-row b{color:var(--w,#701428)}.gx-row small{display:block;color:var(--sub,#6B5A4E);font-size:12.5px;margin-top:2px}'+
'.gx-lv{display:grid;grid-template-columns:1fr auto;gap:4px 10px;align-items:start}'+
'.gx-lv .n{font-weight:900;font-size:15.5px;color:var(--ink,#2B211C)}.gx-lv .m{font-size:12.5px;color:var(--sub,#6B5A4E);font-weight:700}'+
'.gx-lv .tag{grid-column:2;grid-row:1/3;align-self:center;background:var(--w,#701428);color:#fff;font-weight:900;font-size:12.5px;border-radius:9px;padding:6px 9px;text-align:center;white-space:nowrap}'+
'.gx-lv .tag i{display:block;font-style:normal;font-size:10.5px;opacity:.8;font-weight:700}'+
'.gx-lv ul{grid-column:1/-1;margin:6px 0 0 18px;padding:0;font-size:14px;color:var(--ink,#2B211C)}.gx-lv li{margin:2px 0}'+
'.gx-tb{width:100%;border-collapse:collapse;margin-top:12px;font-size:14px}'+
'.gx-tb td,.gx-tb th{border-bottom:1px solid var(--line,#EBDCC0);padding:9px 6px;text-align:left;vertical-align:top}'+
'.gx-tb th{font-size:12.5px;color:var(--sub,#6B5A4E)}.gx-tb td:first-child{font-weight:900;color:var(--w,#701428);white-space:nowrap}'+
'.gx-big{font-size:15px;line-height:1.7;margin-top:10px;color:var(--ink,#2B211C)}.gx-big b{color:var(--w,#701428)}'+
'.gx-pt{display:grid;gap:8px;margin-top:12px}.gx-pt div{border-left:4px solid var(--m,#D99E2C);background:var(--cl,#FFFAF0);border-radius:10px;padding:10px 12px;font-size:14.5px;line-height:1.55}.gx-pt div b{color:var(--w,#701428);display:block}'+
'.gx-note{font-size:11.5px;color:var(--sub,#6B5A4E);margin-top:10px;line-height:1.5}'+
'.gx-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:16px 0 4px}'+
'.gx-grid button{border:1px solid var(--line,#EBDCC0);background:#fff;border-radius:14px;padding:12px 4px;font:inherit;font-weight:900;font-size:14px;color:var(--w,#701428);cursor:pointer;line-height:1.3}.gx-grid button small{display:block;font-weight:700;font-size:11px;color:var(--sub,#6B5A4E)}'+
'.gx-grid button.on{background:var(--w,#701428);color:#fff}.gx-grid button.on small{color:#f3dcc0}'+
'.gx-ov{position:fixed;inset:0;z-index:2147483000;background:var(--c,#F8F0DC);overflow-y:auto;-webkit-overflow-scrolling:touch;display:none}'+
'.gx-ov.open{display:block}.gx-ov .in{max-width:720px;margin:0 auto;padding:18px 14px 130px;display:flex;flex-direction:column;gap:14px}'+
'.gx-ov h1{font-size:26px;color:var(--w,#701428);margin:6px 2px 0;line-height:1.3}.gx-ov .sub{color:var(--sub,#6B5A4E);font-size:14px;margin:0 2px}'+
'.gx-ov .card{margin:0}'+'.gx-pick{grid-template-columns:1fr 1fr!important;gap:10px}.gx-pick button{padding:18px 6px;font-size:17px}.gx-pick button small{font-size:12px}'+
'.gx-close{position:fixed;left:50%;transform:translateX(-50%);bottom:22px;z-index:2147483001;width:72px;height:72px;border-radius:50%;border:0;background:#F5C518;color:#4E0E21;font:900 15px/1 inherit;box-shadow:0 6px 18px rgba(78,14,33,.35);cursor:pointer;display:none}'+
'.gx-ov.open~.gx-close{display:block}'+'html.gx-open [id$="Pop"],html.gx-open #sgPromo,html.gx-open #sgShop,html.gx-open #sgVid{display:none!important}'+
'@media(min-width:900px){.gx-ov .in{max-width:900px}.gx-grid{grid-template-columns:repeat(5,1fr)}.gx-wide{grid-column:1/-1}}';
function lv(a){return '<div class="gx">'+a.map(function(x){return '<div class="gx-row gx-lv"><div class="n">'+x[0]+'</div><div class="m">'+x[1]+'</div><div class="tag">'+(x[3]?'<i>'+x[3]+'</i>':'')+x[2]+'</div><ul>'+x[4].map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul></div>'}).join('')+'</div>'}
function tb(h,r){return '<table class="gx-tb"><tr><th>'+h[0]+'</th><th>'+h[1]+'</th></tr>'+r.map(function(x){return '<tr><td>'+x[0]+'</td><td>'+x[1]+'</td></tr>'}).join('')+'</table>'}
function pt(a){return '<div class="gx-pt">'+a.map(function(x){return '<div><b>'+x[0]+'</b>'+x[1]+'</div>'}).join('')+'</div>'}
var CALL='<a class="cta" href="tel:0314666969" style="margin-top:12px">☎ 031-466-6969 무료 레벨테스트</a>';
var G={
english:{t:'영어회화',e:'ENGLISH',c:[
['WHAT','영어회화반은<br>이런 곳이에요','눈으로 읽는 영어가 아니라 입으로 나오는 영어.','<p class="gx-big">원어민 선생님과 한국인 선생님이 함께 가르치는 <b>말하기 중심 수업</b>이에요. 교재는 <b>인터체인지 · 포코너스</b>, 수업은 <b>주 2회 90분</b>. 처음엔 한국어로 편하게, 올라갈수록 원어민과 더 많이 말합니다.</p>'],
['LEVEL','단계마다<br>이만큼 말하게 돼요','한 단계는 교재 두 권 · 약 4개월. 레벨테스트로 시작 단계를 정해요.',lv([
 ['BASIC · 입문','Interchange Intro + Four Corners 1 · 약 4개월','NH','오픽 목표',['알파벳·발음부터 다시','“I am / I like”로 나를 소개','숫자·시간·가족 소개']],
 ['STEP 1 · 초급','Interchange 1 + Four Corners 2 · 약 4개월','IL','오픽 목표',['현재·과거 시제로 짧게 묻고 답하기','주말·여행 이야기','카페·식당 주문']],
 ['STEP 2 · 초중급','Interchange 2 + Four Corners 3 · 약 4개월','IM1~2','오픽 목표',['이유를 붙여 두 문장 이상 이어 말하기','경험을 순서대로 설명','전화·약속 잡기']],
 ['STEP 3 · 중급','Interchange 3 + Four Corners 4 · 약 4개월','IM3~IH','오픽 목표',['원어민과 일상 대화가 막힘 없이','가정·비교로 내 생각 말하기','회사 소개·업무 설명']],
 ['STEP 4 · 중상급','원어민 프리토킹 · 토론','IH~AL','오픽 목표',['의견을 논리적으로 주장하고 반박','짧은 프레젠테이션','뉴스·시사 주제 토론']]])+'<p class="gx-note">※ 오픽 등급은 수업 내용 기준의 목표입니다. 개인차가 있고 등급을 보장하지 않습니다.</p>'],
['STRENGTH','우리 영어회화의<br>강점','',pt([['원어민 + 한국인 선생님','막히는 문법은 한국어로, 말하기는 원어민과'],['90분 내내 말하는 수업','틀려도 괜찮은 자리, 그 자리에서 고쳐 받아요'],['언제든 등록','매달 1일이 아니어도 등록한 날이 1일차, 놓친 진도는 다음 같은 단계 반에서 채워요'],['원하는 시간에 골라 들어요','저녁 정규반 18:20 · 20:00 / 출근 전 새벽반 06:30'],['산본역 3번 출구 1분','롯데프라자 7층']])+CALL]]},
japanese:{t:'일본어',e:'日本語',c:[
['WHAT','일본어반은<br>이런 곳이에요','あいうえお부터 드라마가 들리는 날까지.','<p class="gx-big">일본인 원어민 선생님의 발음을 듣고 바로 따라 하고, 한국인 선생님이 문법을 쉽게 풀어 줘요. 교재는 <b>다이스키 → 아리가또</b>, 회화 단계와 <b>JLPT반</b>을 한 학원에서 이어 갑니다.</p>'],
['LEVEL','단계마다<br>이만큼 말하게 돼요','교재 한 권씩, 몇 달 과정인지 한눈에.',lv([
 ['다이스키 STEP 1 · 입문','2개월','N5','JLPT 목표',['히라가나·가타카나','인사와 자기소개','~です, こそあど']],
 ['다이스키 STEP 2 · 초급','2개월','N4','JLPT 목표',['동사 ます형으로 하루 말하기','~ている, ~た형','「週末は映画を見ました」']],
 ['다이스키 STEP 3 · 초중급','3개월','N4~N3','JLPT 목표',['하고 싶은 것·할 수 있는 것','가능형, ~ない, ~たら·~なら','여행 일본어 자유롭게']],
 ['아리가또 1단계 · 중급','4개월','N3','JLPT 목표',['드라마 대사가 들리기 시작','수동·사역, 존경어 입문']],
 ['아리가또 2단계 · 중고급','4개월','N2','JLPT 목표',['경어로 내 생각을 자연스럽게','의견 말하기, 업무 일본어 기초']]])+'<p class="gx-note">※ JLPT 급수는 수업 내용 기준의 목표입니다. 시험반(N4→N1)은 따로 운영합니다.</p>'],
['STRENGTH','우리 일본어의<br>강점','',pt([['일본인 원어민 + 한국인 선생님','발음은 원어민 그대로, 문법은 한국어로 바로'],['회화에서 자격증까지','다이스키·아리가또 회화 → JLPT반으로 연결'],['스파르타반','짧은 기간에 진도를 빠르게'],['산본역 3번 출구 1분','롯데프라자 7층']])+CALL]]},
chinese:{t:'중국어',e:'中文',c:[
['WHAT','중국어반은<br>이런 곳이에요','성조가 잡히면 중국어가 들리기 시작해요.','<p class="gx-big">첫 달은 <b>발음과 성조</b>를 탄탄하게. 선생님이 입 모양까지 바로 잡아 줘요. 교재는 <b>맛있는 중국어 · 신공략</b>, 단계마다 <b>HSK 급수</b>와 연결됩니다.</p>'],
['LEVEL','단계마다<br>이만큼 말하게 돼요','레벨테스트로 시작 단계를 정하고, 교재 한 권씩 올라가요.',lv([
 ['입문','3개월 · 중국어 첫걸음(스피킹)','1~2급','HSK 목표',['성조·병음','인사와 자기소개']],
 ['초급','4개월 · 맛있는 중국어 Level 3','3급','HSK 목표',['짧은 문장으로 묻고 답하기','쇼핑·길 묻기']],
 ['초중급','4개월 · 맛있는 중국어 Level 4','4급','HSK 목표',['일상 대화가 이어져요','了·过로 경험 말하기']],
 ['중급','4~6개월 · Level 5 + 신공략 5','5급','HSK 목표',['내 경험을 길게 설명','업무 메일 읽기']],
 ['중고급','4~6개월 · Level 6 + 신공략 6','6급','HSK 목표',['뉴스·업무 대화까지','토론·발표']]])+'<p class="gx-note">※ HSK 급수는 수업 내용 기준의 목표입니다.</p>'],
['STRENGTH','우리 중국어의<br>강점','',pt([['발음·성조부터 꼼꼼하게','입 모양까지 바로 잡아 줘요'],['회화 + HSK 한 학원에서','급수별 유형 수업까지 연결'],['스파르타반','짧은 기간에 진도를 빠르게'],['산본역 3번 출구 1분','롯데프라자 7층']])+CALL]]},
toeic:{t:'토익',e:'TOEIC',c:[
['WHAT','토익은<br>이런 시험이에요','취업·졸업·승진 서류의 영어 칸을 채우는 시험.','<p class="gx-big">듣기(LC) 495점 + 읽기(RC) 495점, <b>990점 만점</b>이에요. 회사·학교가 영어 실력을 숫자로 확인할 때 가장 많이 보는 시험입니다.</p>'],
['SCORE','점수대별로<br>이런 곳에 써요','',tb(['점수','많이 쓰이는 곳'],[['700점 미만','스펙으로 쓰기 어려운 구간'],['700~799점','일부 중소기업·이공계 지원'],['800~899점','대기업·공기업 사무직 기본선'],['900점 이상','외국계·해외영업 경쟁력']])+'<p class="gx-note">※ 취업 커뮤니티 공개 자료 기준 · 회사·학교마다 다르니 공고를 확인하세요.</p>'],
['LEVEL','우리 토익반은<br>이렇게 진행돼요','LC·RC를 한 반에서 같이, 내 속도에 맞춰 골라요.',lv([
 ['초급','스파르타 1개월 / 정규 2개월','기본서','LC·RC',['LC·RC 기본서 한 권을 끝내요','파트별 문제 유형 익히기','스파르타 월~금 12:10~14:10']],
 ['중급','스파르타 1개월 / 정규 2개월','실전','LC·RC',['유형별 오답 정리','시간 안에 푸는 연습','스파르타 월~금 10:00~12:00']],
 ['실전반','실전 모의고사','목표점수','실전',['실제 시험처럼 풀고 바로 해설','스파르타 14:10~16:10']]])+'<p class="gx-note">초급+중급을 한 번에 등록하면 스파르타 840,000원 → 640,000원, 정규 840,000원 → 640,000원.</p>'],
['STRENGTH','우리 토익의<br>강점','산본토익전문학원 산본글로벌어학원',pt([['송윤정 엘리킴 김현정 쓰리스타 강사진으로 토익을 정복하다',''],['스파르타 · 정규 선택','한 달에 끝내거나, 두 달에 차근차근'],['언제든 등록','등록한 날이 1일차, 놓친 진도는 다음 같은 단계 반에서 채워요'],['산본역 3번 출구 1분','롯데프라자 7층']])+CALL]]},
toefl:{t:'토플',e:'TOEFL',c:[
['WHAT','토플은<br>이런 시험이에요','해외 대학·대학원 입학에 쓰는 영어 시험.','<p class="gx-big">읽기·듣기·말하기·쓰기 네 영역을 봐요. 점수는 그동안 <b>0~120점</b>으로 나왔고, 2026년 1월부터는 <b>1~6점 밴드</b>로도 표시됩니다.</p>'],
['SCORE','점수대별로<br>이런 곳에 써요','',tb(['점수','많이 쓰이는 곳'],[['60~70점','커뮤니티 칼리지·일부 주립대'],['80~90점','미국 중간 수준 대학'],['90~100점 이상','미국 상위권 대학'],['100점 이상','영국 옥스퍼드·임페리얼 등']])+'<p class="gx-note">※ ETS 공식 안내 기준 · 학교·학과마다 요구 점수가 다릅니다.</p>'],
['CLASS','우리 토플반','',pt([['2개월 과정','네 영역 유형별 수업'],['말하기·쓰기 첨삭','선생님이 직접 고쳐 줘요'],['산본역 3번 출구 1분','롯데프라자 7층']])+CALL]]},
opic:{t:'오픽',e:'OPIc',c:[
['WHAT','오픽은<br>이런 시험이에요','컴퓨터 속 면접관과 40분 대화하는 말하기 시험.','<p class="gx-big">점수가 아니라 <b>등급</b>으로 나와요. 아래에서 위로 <b>NL · NM · NH · IL · IM1 · IM2 · IM3 · IH · AL</b> 순서이고, 성적은 2년 동안 유효합니다.</p>'],
['GRADE','등급마다<br>이만큼 말해요','',tb(['등급','이 정도 말해요'],[['AL','예상 못한 상황도 막힘없이 해결'],['IH','처음 듣는 질문도 이야기로 풀어요'],['IM1~IM3','일상 주제를 문장 여러 개로'],['IL','익숙한 주제를 문장으로 이어 말해요'],['NL~NH','단어·외운 표현 위주']])],
['AT WORK','회사에서는<br>이렇게 써요','',tb(['구분','알려진 기준'],[['삼성 이공계','IL 이상'],['삼성 경영·영업','IM 이상'],['실제 경쟁력','IH'],['삼성 사내 1등급','AL'],['사내 2등급','IM3 · IH'],['사내 3등급','IM1 · IM2'],['사내 4등급','IL']])+'<p class="gx-note">※ 취업 커뮤니티 공개 자료로 정리 · 계열사·직무·연도마다 다르니 공고·사내 공지를 확인하세요.</p>'],
['CLASS','우리 오픽반','',pt([['2개월 과정','자기소개·묘사·경험·롤플레이 4유형'],['회화반과 연결','영어회화 STEP 2부터 첫 응시를 권해요'],['산본역 3번 출구 1분','롯데프라자 7층']])+CALL]]},
toss:{t:'토익스피킹',e:'TOEIC Speaking',c:[
['WHAT','토익스피킹은<br>이런 시험이에요','업무 상황 영어 말하기 시험.','<p class="gx-big"><b>0~200점</b>을 10점 단위로 매기고, 점수에 따라 등급이 붙어요. 오픽과 함께 회사가 가장 많이 보는 말하기 시험입니다.</p>'],
['SCORE','점수대별로<br>이렇게 봐요','',tb(['점수 · 등급','많이 쓰이는 곳'],[['110~120 · IM1~IM2','항공 객실·일부 공기업 최소 요건'],['130 · IM3','대기업 최소 요건이 많은 구간'],['140~150 · IH','공기업 우대·대기업 경쟁 구간'],['160~170 · AL','해외 업무 많은 기업 필수 사례']])+'<p class="gx-note">※ 2026년 채용 공고 사례 기준 · 공고마다 다릅니다.</p>'],
['CLASS','우리 토스반','',pt([['2개월 과정','파트별 답변 틀과 실전 녹음 연습'],['녹음 첨삭','내 답변을 선생님이 직접 고쳐 줘요'],['산본역 3번 출구 1분','롯데프라자 7층']])+CALL]]},
jlpt:{t:'JLPT',e:'日本語能力試験',c:[
['WHAT','JLPT는<br>이런 시험이에요','일본어 능력을 급수로 확인하는 시험.','<p class="gx-big"><b>N5(쉬움) ~ N1(어려움)</b> 다섯 급수. N4·N5는 교실에서 배우는 기초, N1·N2는 실생활 전반의 일본어, N3는 그 사이를 잇는 단계예요.</p>'],
['LEVEL','급수별로<br>이렇게 써요','',tb(['급수','많이 쓰이는 곳'],[['N5·N4','기초 확인 · 여행 일본어'],['N3','대외적으로 어필하는 첫 급수'],['N2','회사 스펙으로 보는 최소선'],['N1','일본 취업 공고 필수 사례']])+'<p class="gx-note">※ JLPT 공식 안내 · 취업 커뮤니티 의견 기준.</p>'],
['CLASS','우리 JLPT반','',pt([['N4 → N3 → N2 → N1','회화 단계와 연결해 급수별 반'],['문자·어휘·문법·독해·청해','영역별 실전 문제'],['산본역 3번 출구 1분','롯데프라자 7층']])+CALL]]},
hsk:{t:'HSK',e:'汉语水平考试',c:[
['WHAT','HSK는<br>이런 시험이에요','중국어 능력을 급수로 확인하는 시험.','<p class="gx-big">1급부터 6급까지 올라가며(새 체계는 9급까지), 듣기·읽기·쓰기를 봐요. 급마다 <b>60% 이상</b> 받으면 합격입니다.</p>'],
['LEVEL','급수별로<br>이렇게 써요','',tb(['급수','많이 쓰이는 곳'],[['1~3급','기초 확인'],['4급','취업에서 보는 출발선'],['5급','실무 활용 증명'],['6급','고급 · 통번역·주재원']])+'<p class="gx-note">※ 취업 커뮤니티 의견 기준 · 회사·학교마다 다릅니다.</p>'],
['CLASS','우리 HSK반','',pt([['3급 ~ 6급','급수별 유형 수업'],['회화반과 연결','맛있는 중국어 Level 3~6과 같이'],['산본역 3번 출구 1분','롯데프라자 7층']])+CALL]]}
};
var ORDER=['english','japanese','chinese','toeic','toefl','opic','toss','jlpt','hsk'];
function cardsHTML(k){return G[k].c.map(function(c){return '<section class="card gx-card"><div class="pad"><div class="no">'+c[0]+'</div><h2>'+c[1]+'</h2>'+(c[2]?'<p class="lead">'+c[2]+'</p>':'')+c[3]+'</div></section>'}).join('')}
function gridHTML(cur){return '<div class="gx-grid">'+ORDER.map(function(k){return '<button type="button" data-g="'+k+'"'+(k==cur?' class="on"':'')+'>'+G[k].t+'<small>이렇게 진행돼요</small></button>'}).join('')+'</div>'}
function init(){
 var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
 var page=document.body.getAttribute('data-guide');
 var secs=[].slice.call(document.querySelectorAll('section.card'));
 function find(t){return secs.filter(function(s){var n=s.querySelector('.no');return n&&n.textContent.indexOf(t)>-1})[0]}
 var road=find('ROADMAP'),teach=find('TEACHERS'),visit=find('VISIT');
 if(page&&G[page]&&teach){var w=document.createElement('div');w.innerHTML=cardsHTML(page);while(w.firstChild)teach.parentNode.insertBefore(w.firstChild,teach);if(road)road.remove();}
 var n=0;[].forEach.call(document.querySelectorAll('.page section.card .no'),function(e){n++;e.textContent=(n<10?'0':'')+n+' — '+e.textContent.replace(/^\d+\s*—\s*/,'')});
 if(visit){var o=visit.querySelector('.others');var box=document.createElement('div');box.innerHTML='<p class="lead" style="margin-top:14px"><b>다른 과정도 이렇게 진행돼요</b> — 눌러서 보세요</p>'+gridHTML(page);if(o)o.replaceWith(box);else visit.querySelector('.pad').appendChild(box);}
 var ov=document.createElement('div');ov.className='gx-ov';ov.innerHTML='<div class="in"></div>';var cl=document.createElement('button');cl.className='gx-close';cl.type='button';cl.textContent='닫기';
 document.body.appendChild(ov);document.body.appendChild(cl);
 function open(k){ov.querySelector('.in').innerHTML='<h1>'+G[k].t+', 이렇게 진행돼요</h1><p class="sub">'+G[k].e+' · 산본글로벌어학원</p>'+cardsHTML(k)+gridHTML(k);ov.scrollTop=0;ov.classList.add('open');document.documentElement.style.overflow='hidden';document.documentElement.classList.add('gx-open');try{history.pushState({gx:k},'')}catch(e){}}
 function close(){ov.classList.remove('open');document.documentElement.style.overflow='';document.documentElement.classList.remove('gx-open')}
 document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-g]');if(b){e.preventDefault();open(b.getAttribute('data-g'))}});
 cl.addEventListener('click',function(){close();try{if(history.state&&history.state.gx)history.back()}catch(e){}});
 window.addEventListener('popstate',function(){if(ov.classList.contains('open'))close()});
 function picker(){ov.querySelector('.in').innerHTML='<h1>어떤 과정이 궁금하세요?</h1><p class="sub">원하는 과목을 누르면 「이렇게 진행돼요」가 열려요</p><section class="card"><div class="pad">'+gridHTML(null).replace('gx-grid','gx-grid gx-pick')+'</div></section>';ov.scrollTop=0;ov.classList.add('open');document.documentElement.style.overflow='hidden';document.documentElement.classList.add('gx-open');try{history.pushState({gx:'pick'},'')}catch(e){}}
 window.SGA_GUIDE={open:open,close:close,picker:picker};
}
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
