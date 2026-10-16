/* 아키 시험문제풀이반 — 실전 시험 엔진 (산본글로벌어학원)
   2026-10-01 대표님 「문제풀이는 정확하게 그 시험유형에 똑같이 해서 시간도 문제형식도 전부 비슷하게 해. 총문제수 난이도도 전부」
   - 시험지(JSON)와 음성(mp3)은 exam/ 폴더. 듣기는 실제 시험처럼 한 번만, 멈춤·되감기 없음
   - 영역(섹션)마다 실제 시험 시간. 끝난 영역으로는 돌아갈 수 없음
   - 말하기(토익스피킹·OPIc)는 준비·답변 시간 + 녹음(기기 안에만 남고 서버로 보내지 않음) */
(function () {
  'use strict';
  var A = window.AKX = {}, D = null, S = null, AU = null, TICK = null, REC = null, STREAM = null;
  var VER = '20261002d';
  var NAME = { toeic: '토익', tos: '토익스피킹', opic: 'OPIc', jlpt: 'JLPT', hsk: 'HSK' };

  /* ───────── 공통 도구 ───────── */
  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function rich(t) { /* 지문용: <u>·<b>·<table> 등 시험지 태그만 살리고 나머지는 글자로 */
    t = String(t == null ? '' : t);
    if (/<table/i.test(t)) return t;
    return esc(t).replace(/&lt;(\/?)(u|b|i|br)&gt;/g, '<$1$2>').replace(/\n/g, '<br>');
  }
  function mmss(s) { s = Math.max(0, Math.round(s)); var m = Math.floor(s / 60); return (m < 10 ? '0' : '') + m + ':' + (s % 60 < 10 ? '0' : '') + s % 60; }
  function lab(j, n, opts) {
    if (opts && (opts[0] === '✓' || opts[0] === '✗')) return opts[j];
    return D.exam === 'jlpt' ? String(j + 1) : 'ABCDEF'.charAt(j);
  }
  function blankify(t) { return rich(t).replace(/-{4,}|＿{3,}|_{4,}/g, '<span class="blank"></span>'); }
  function beep(f, ms) {
    try { var C = A._ac || (A._ac = new (window.AudioContext || window.webkitAudioContext)()); var o = C.createOscillator(), g = C.createGain();
      o.frequency.value = f || 880; o.connect(g); g.connect(C.destination); g.gain.value = .12; o.start(); o.stop(C.currentTime + (ms || 350) / 1000); } catch (e) { }
  }
  function say(t) { try { var u = new SpeechSynthesisUtterance(t); u.lang = 'ko-KR'; u.rate = 1; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { } }

  /* ───────── 문항 펼치기: 영역마다 번호가 매겨진 문항 목록 ───────── */
  function optCount(it, p) {
    if (p.type === 'photo') return 4;
    if (p.type === 'match') return (p.imgs || p.opts || []).length;
    if (p.type === 'qr') { var c = 0; (it.say || []).forEach(function (l) { if (/^\s*(\([A-D]\)|[1-4][\.．、]\s*)/.test(l.t || '')) c++; }); return c || 3; }
    return (it.o || []).length;
  }
  function flatten() {
    var base = 0;
    D.sections.forEach(function (sec, si) {
      var n = (D.exam === 'toeic' || D.exam === 'hsk') ? base : 0; /* 토익·HSK는 실제 시험지처럼 1번부터 끝까지 이어서 번호 */
      sec._qs = [];
      sec.parts.forEach(function (p, pi) {
        (p.items || []).forEach(function (it, ii) {
          if (p.type === 'set') {
            it._n0 = n + 1;
            it.qs.forEach(function (q, k) { n++; sec._qs.push({ n: n, si: si, pi: pi, ii: ii, k: k, kind: 'set', it: it, q: q, oc: (q.o || []).length, a: q.a, ex: q.ex, opts: q.o }); });
          } else if (p.type === 'speak') {
            n++; it._n = n; sec._qs.push({ n: n, si: si, pi: pi, ii: ii, kind: 'speak', it: it });
          } else if (p.type === 'input') {
            n++; it._n = n; sec._qs.push({ n: n, si: si, pi: pi, ii: ii, kind: 'input', it: it, ans: it.ans, ex: it.ex });
          } else {
            n++; it._n = n;
            var oc = optCount(it, p);
            sec._qs.push({ n: n, si: si, pi: pi, ii: ii, kind: p.type, it: it, oc: oc, a: it.a, ex: it.ex, opts: it.o || (p.type === 'match' ? null : null) });
          }
        });
      });
      base += sec._qs.length;
    });
  }

  /* ───────── 화면 틀 ───────── */
  function css() {
    if ($('akxCss')) return;
    var st = document.createElement('style'); st.id = 'akxCss';
    st.textContent = '#akx{position:fixed;inset:0;z-index:2147483000;background:#FBF7EF;color:#1A1A18;font-family:inherit;user-select:none;-webkit-user-select:none;display:flex;flex-direction:column}'
      + '#akx .bar{display:flex;align-items:center;gap:10px;padding:9px 14px;background:#0A5C3D;color:#fff;font-weight:900}'
      + '#akx .bar .tt{flex:1;font-size:14.5px;line-height:1.3}#akx .bar .tt small{display:block;font-size:12px;opacity:.9}'
      + '#akx .bar .tm{font-size:21px;letter-spacing:1px;background:#fff;color:#0A5C3D;border-radius:10px;padding:2px 10px;min-width:84px;text-align:center}'
      + '#akx .bar .tm.warn{color:#C81F2B}#akx .bar button{height:40px;border:0;border-radius:10px;background:#FFC93C;color:#1A1A18;font-weight:900;font-size:14.5px;padding:0 14px;cursor:pointer}'
      + '#akx .main{flex:1;display:flex;min-height:0}#akx .bk{flex:1;overflow-y:auto;padding:16px 22px 120px;position:relative}'
      + '#akx .omr{width:250px;flex:none;border-left:2px solid #D9C9B0;background:#fff;overflow-y:auto;padding:12px}'
      + '#akx .omr h4{margin:0 0 8px;font-size:14px;font-weight:900;color:#5A1E08}#akx .orow{display:flex;align-items:center;gap:4px;margin:0 0 5px;font-size:12.5px;font-weight:800}'
      + '#akx .orow i{font-style:normal;width:26px;text-align:right;margin-right:2px}#akx .orow.cur i{color:#C81F2B}'
      + '#akx .ob{min-width:24px;height:22px;border:1.6px solid #1A1A18;border-radius:50%;font-size:10.5px;font-weight:900;background:#fff;cursor:pointer;padding:0 3px}#akx .ob.on{background:#1A1A18;color:#fff}'
      + '#akx .ph{margin:6px 0 14px;padding:10px 14px;background:#EFE6D6;border-left:6px solid #0A5C3D;border-radius:8px;font-size:15px;font-weight:800;max-width:820px}#akx .ph b{display:block;font-size:16.5px;color:#0A5C3D;margin-bottom:2px}'
      + '#akx .q{margin:0 0 20px;max-width:820px;scroll-margin-top:12px}#akx .q.cur{outline:3px solid #FFC93C;outline-offset:6px;border-radius:6px}'
      + '#akx .q p{font-size:16.5px;font-weight:800;line-height:1.65;margin:0 0 8px}#akx .q .num{color:#0A5C3D;margin-right:6px}'
      + '#akx .op{display:grid;grid-template-columns:1fr 1fr;gap:6px}#akx .op.one{grid-template-columns:1fr}'
      + '#akx .op button{text-align:left;padding:9px 12px;border:2px solid #D9C9B0;border-radius:10px;background:#fff;font-size:15px;font-weight:800;color:#1A1A18;cursor:pointer;line-height:1.45}'
      + '#akx .op button.on{border-color:#0A5C3D;background:#DDF2E5}#akx .op button.ok{border-color:#0A5C3D;background:#DDF2E5}#akx .op button.ng{border-color:#C81F2B;background:#FBE0E0}'
      + '#akx .mark{display:flex;gap:8px;flex-wrap:wrap}#akx .mark button{width:52px;height:44px;border:2px solid #D9C9B0;border-radius:10px;background:#fff;font-size:17px;font-weight:900;cursor:pointer}#akx .mark button.on{border-color:#0A5C3D;background:#DDF2E5}#akx .mark button.ok{border-color:#0A5C3D;background:#DDF2E5}#akx .mark button.ng{border-color:#C81F2B;background:#FBE0E0}'
      + '#akx .pic{max-width:520px;width:100%;border-radius:10px;border:2px solid #D9C9B0;display:block;margin:0 0 8px;pointer-events:none}'
      + '#akx .imgs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:640px;margin:0 0 14px}#akx .imgs figure{margin:0;position:relative}#akx .imgs img{width:100%;border-radius:8px;border:2px solid #D9C9B0;display:block;pointer-events:none}#akx .imgs figcaption{position:absolute;left:6px;top:6px;background:#fff;border-radius:6px;padding:0 7px;font-weight:900}'
      + '#akx .opts{max-width:820px;background:#fff;border:1.5px solid #E7D8C8;border-radius:10px;padding:8px 14px;margin:0 0 14px;font-size:15.5px;font-weight:800;line-height:1.8}'
      + '#akx .psg{max-width:820px;background:#fff;border:1.5px solid #D9C9B0;border-radius:10px;padding:12px 16px;margin:0 0 10px;font-size:15px;font-weight:600;line-height:1.75}#akx .psg h5{margin:0 0 6px;font-size:13px;color:#5A1E08;font-weight:900}'
      + '#akx table{border-collapse:collapse;margin:6px 0;font-size:14px;font-weight:700;max-width:100%}#akx td,#akx th{border:1.4px solid #B9A88E;padding:5px 9px;text-align:left}#akx th{background:#EFE6D6}#akx caption{font-weight:900;padding:4px 0;text-align:left}'
      + '#akx u{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px}#akx .blank{display:inline-block;min-width:70px;border-bottom:2.5px solid #1A1A18;margin:0 3px}'
      + '#akx input.inp{width:100%;max-width:560px;height:46px;border:2px solid #D9C9B0;border-radius:10px;padding:0 12px;font-size:18px;font-weight:800;user-select:text;-webkit-user-select:text}#akx input.inp.ok{border-color:#0A5C3D;background:#DDF2E5}#akx input.inp.ng{border-color:#C81F2B;background:#FBE0E0}'
      + '#akx .ex{border:1.5px solid #B06A3A;border-radius:10px;background:#FBEFE3;padding:8px 12px;font-size:14px;font-weight:700;margin-top:6px;line-height:1.65}'
      + '#akx .scr{border:1.5px dashed #0A5C3D;border-radius:10px;background:#F2F8F3;padding:8px 12px;font-size:13.5px;font-weight:600;margin-top:6px;line-height:1.6}'
      + '#akx .center{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;overflow-y:auto}'
      + '#akx .clk{width:150px;height:150px;flex:none;border-radius:50%;border:6px solid #0A5C3D;position:relative;background:#fff;margin:0 auto 14px;box-shadow:0 6px 20px rgba(0,0,0,.12)}'
      + '#akx .clk b{position:absolute;left:50%;bottom:50%;width:3px;height:62px;margin-left:-1.5px;background:#C81F2B;transform-origin:50% 100%;animation:akxs 60s steps(60) infinite}'
      + '#akx .clk s{position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#0A5C3D}@keyframes akxs{to{transform:rotate(360deg)}}'
      + '#akx .sayb{display:flex;align-items:flex-end;gap:10px;justify-content:center;margin:6px 0 14px}#akx .sayb img{width:92px;height:92px;object-fit:contain}'
      + '#akx .sayb div{background:#fff;border:2px solid #0A5C3D;border-radius:16px 16px 16px 4px;padding:12px 16px;font-size:18px;font-weight:900;max-width:380px;text-align:left;line-height:1.5}'
      + '#akx .rules{font-size:14.5px;font-weight:700;line-height:1.75;text-align:left;background:#fff;border:1.5px solid #E7D8C8;border-radius:12px;padding:10px 16px;margin:0 0 14px;max-width:480px}'
      + '#akx .rules table{width:100%}#akx .go{height:56px;min-width:220px;border:0;border-radius:14px;background:#0A5C3D;color:#fff;font-size:20px;font-weight:900;cursor:pointer;margin:4px}'
      + '#akx .no{height:48px;border:0;border-radius:12px;background:#E7D8C8;color:#1A1A18;font-size:15px;font-weight:800;padding:0 18px;margin:4px;cursor:pointer}'
      + '#akx .cf{position:absolute;inset:0;background:rgba(251,247,239,.93);display:flex;align-items:center;justify-content:center;z-index:9}#akx .cf>div{background:#fff;border:2px solid #0A5C3D;border-radius:16px;padding:18px;max-width:360px;text-align:center;font-size:16px;font-weight:800;line-height:1.6}'
      + '#akx .spk{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;align-items:center}#akx .spk .box{width:100%;max-width:760px}'
      + '#akx .stat{width:100%;max-width:760px;margin:12px 0;background:#fff;border:2px solid #0A5C3D;border-radius:14px;padding:10px 14px;text-align:center}'
      + '#akx .stat b{display:block;font-size:14px;color:#0A5C3D;letter-spacing:1px}#akx .stat strong{display:block;font-size:34px;font-weight:900}#akx .stat .gauge{height:10px;border-radius:6px;background:#E7D8C8;overflow:hidden;margin-top:6px}#akx .stat .gauge i{display:block;height:100%;background:#0A5C3D;width:0}'
      + '#akx .stat.resp{border-color:#C81F2B}#akx .stat.resp b{color:#C81F2B}#akx .stat.resp .gauge i{background:#C81F2B}'
      + '#akx .rtext{font-size:19px;font-weight:700;line-height:1.75;background:#fff;border:1.5px solid #D9C9B0;border-radius:12px;padding:14px 18px}'
      + '#akx .res{max-width:820px;margin:0 auto}#akx .res .sum{width:100%;border-collapse:collapse;margin:8px 0 16px;font-size:15px}#akx .res .sum td,#akx .res .sum th{border:1.5px solid #B9A88E;padding:7px 10px;text-align:center}'
      + '#akx .big{font-size:42px;font-weight:900;color:#0A5C3D;margin:6px 0}#akx .note{font-size:12.5px;font-weight:700;color:#5A4E42}'
      + '#akx .lv{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}#akx .lv button{height:52px;min-width:110px;border:2px solid #0A5C3D;border-radius:12px;background:#fff;font-size:16px;font-weight:900;cursor:pointer}'
      + '@media(max-width:860px){#akx .omr{position:fixed;left:0;right:0;bottom:0;width:auto;height:112px;z-index:30;box-shadow:0 -4px 12px rgba(0,0,0,.08);border-left:0;border-top:2px solid #D9C9B0;display:flex;flex-wrap:wrap;gap:4px 10px;align-content:flex-start;padding:8px 10px}#akx .omr h4{width:100%;margin:0}#akx .op{grid-template-columns:1fr}#akx .bk{padding:12px 13px 140px}#akx .imgs{grid-template-columns:repeat(2,1fr)}#akx .bar .tt{font-size:13px}#akx .bar button{padding:0 10px;font-size:13.5px}}'
      + '@media print{#akx{display:none!important}}';
    document.head.appendChild(st);
  }
  function wm() { return (typeof window.sgaQzWM === 'function') ? window.sgaQzWM() : ''; }
  function shell(inner) {
    var w = $('akx'); if (!w) { w = document.createElement('div'); w.id = 'akx'; document.body.appendChild(w); }
    w.innerHTML = inner; document.body.style.overflow = 'hidden';
    w.oncontextmenu = function (e) { e.preventDefault(); };
    w.oncopy = function (e) { e.preventDefault(); };
    return w;
  }
  function keyBlock(e) { if ((e.ctrlKey || e.metaKey) && /^[pcsau]$/i.test(e.key)) { e.preventDefault(); } }
  function bar(sec, right) {
    return '<div class="bar"><div class="tt">' + esc(D.title) + '<small>' + esc(sec ? sec.name : '') + '</small></div><div class="tm" id="akxTm">--:--</div>' + (right || '') + '</div>';
  }
  function stopAll() {
    if (TICK) { clearInterval(TICK); TICK = null; }
    if (AU) { try { AU.pause(); } catch (e) { } AU.onended = null; AU.ontimeupdate = null; }
    try { if (REC && REC.state === 'recording') REC.stop(); } catch (e) { }
  }
  A.close = function (force) {
    if (!force && S && !S.done) {
      return confirmBox('지금 나가시면 이번 회차는 <b>채점되지 않고 끝납니다.</b><br>정말 나가시겠습니까?', '나가기', function () { A.close(true); });
    }
    stopAll(); try { if (STREAM) STREAM.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { } STREAM = null;
    var w = $('akx'); if (w) w.remove(); document.body.style.overflow = ''; window.onbeforeunload = null;
    document.removeEventListener('keydown', keyBlock, true);
  };
  function confirmBox(html, okTxt, ok) {
    var w = $('akx'); var c = document.createElement('div'); c.className = 'cf';
    c.innerHTML = '<div>' + html + '<br><button class="go" style="min-width:120px;height:46px;font-size:16px" id="akxOk">' + okTxt + '</button><button class="no" id="akxNo">계속 풀기</button></div>';
    w.appendChild(c); $('akxOk').onclick = function () { c.remove(); ok(); }; $('akxNo').onclick = function () { c.remove(); };
  }

  /* ───────── 시작 ───────── */
  A.start = function (id) {
    css();
    shell('<div class="bar"><div class="tt">아키 시험문제풀이반</div></div><div class="center"><div class="clk"><b></b><s></s></div><p style="font-weight:900">시험지를 펼치는 중입니다…</p></div>');
    fetch('exam/' + id + '.json?v=' + VER).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
      D = d; S = { si: 0, ans: {}, txt: {}, rec: {}, done: false, lv: null }; flatten(); intro();
    }).catch(function () {
      shell('<div class="bar"><div class="tt">아키 시험문제풀이반</div><button onclick="AKX.close(true)">닫기</button></div><div class="center"><p style="font-weight:900;font-size:17px">시험지를 불러오지 못했습니다.<br>인터넷 연결을 확인하고 다시 눌러 주세요.</p></div>');
    });
  };
  function totalInfo() {
    var rows = '', tq = 0, tt = 0;
    D.sections.forEach(function (s) {
      var t = s.time || (s.audio ? s.audio.dur : 0);
      if (s.key === 'S' && !s.time) { t = s.audio ? s.audio.dur : 0; s._qs.forEach(function (q) { t += (q.it.prep || 0) + (q.it.resp || 0) + (q.it.readTime || 0); }); }
      tq += s._qs.length; tt += t || 0;
      rows += '<tr><td>' + esc(s.name) + '</td><td>' + s._qs.length + '문항</td><td>' + (t ? Math.round(t / 60) + '분' : '문항별') + '</td></tr>';
    });
    return { rows: rows, tq: tq, tt: tt };
  }
  function intro() {
    var T = totalInfo(), nm = NAME[D.exam] || '시험';
    var speak = D.exam === 'tos' || D.exam === 'opic';
    var line = '준비되셨습니까? 시작을 누르시면 진짜 ' + nm + '처럼 시험이 시작됩니다.';
    shell(bar(null, '<button onclick="AKX.close(true)">나가기</button>')
      + '<div class="center"><div class="clk"><b></b><s></s></div>'
      + '<div class="sayb"><img src="img/sgi_talk.png" alt="산글이"><div>준비되셨습니까?<br><span style="font-size:15px;font-weight:700">시작을 누르시면 진짜 ' + esc(nm) + '처럼 시험이 시작됩니다.</span></div></div>'
      + '<div class="rules"><table><tr><th>영역</th><th>문항</th><th>시간</th></tr>' + T.rows + '<tr><th>합계</th><th>' + T.tq + '문항</th><th>' + (T.tt ? '약 ' + Math.round(T.tt / 60) + '분' : '') + '</th></tr></table>'
      + (speak ? '🎙 마이크 사용을 허용하시면 답변이 녹음되어 끝난 뒤 모범답안과 비교해 들을 수 있습니다. 녹음은 이 기기 안에만 있고 어디로도 보내지 않습니다.<br>' :
        '🎧 듣기는 실제 시험처럼 <b>한 번만</b> 나오고 멈추거나 되감을 수 없습니다. 이어폰을 준비해 주세요.<br>')
      + '⏱ 영역마다 실제 시험 시간 · 시간이 끝나면 다음 영역으로 넘어가고, 끝난 영역으로는 돌아갈 수 없습니다.<br>🚫 저장·인쇄·복사 없음 · 다 끝나면 바로 채점과 문항별 해설</div>'
      + '<button class="go" onclick="AKX.begin()">시작</button><button class="no" onclick="AKX.close(true)">다음에 하기</button></div>');
    say(line);
    document.addEventListener('keydown', keyBlock, true);
  }
  A.begin = function () {
    try { speechSynthesis.cancel(); } catch (e) { }
    window.onbeforeunload = function () { return '시험이 진행 중입니다.'; };
    beep(660, 200);
    var speak = D.exam === 'tos' || D.exam === 'opic';
    if (speak && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (st) { STREAM = st; runSection(0); }).catch(function () { STREAM = null; runSection(0); });
    } else runSection(0);
  };

  /* ───────── 영역 진행 ───────── */
  function runSection(si) {
    stopAll(); S.si = si; var sec = D.sections[si];
    if (!sec) return finish();
    if (sec.key === 'S') return speakStart(sec);
    paintBooklet(sec);
    if (sec.audio && (sec.key === 'LC' || sec.key === 'L')) listenRun(sec); else readRun(sec);
  }
  function between(si) {
    stopAll();
    var nx = D.sections[si + 1];
    if (!nx) return finish();
    var t = nx.time || (nx.audio ? nx.audio.dur : 0);
    shell(bar(D.sections[si], '') + '<div class="center"><div class="sayb"><img src="img/sgi_talk.png" alt=""><div>' + esc(D.sections[si].name) + ' 영역이 끝났습니다.<br><span style="font-size:15px;font-weight:700">다음 영역: <b>' + esc(nx.name) + '</b> · ' + nx._qs.length + '문항' + (t ? ' · ' + Math.round(t / 60) + '분' : '') + '</span></div></div>'
      + '<button class="go" onclick="AKX.next(' + (si + 1) + ')">다음 영역 시작</button></div>');
    $('akxTm').textContent = '대기';
  }
  A.next = function (si) { runSection(si); };

  function omrHTML(sec) {
    var h = '<h4>답안지 (OMR) · <span id="akxCnt">0</span>/' + sec._qs.length + '</h4>';
    sec._qs.forEach(function (q) {
      if (q.kind === 'speak') return;
      h += '<div class="orow" id="akxO' + q.n + '"><i>' + q.n + '</i>';
      if (q.kind === 'input') h += '<span style="font-size:11px;color:#5A4E42">쓰기</span>';
      else for (var j = 0; j < q.oc; j++) h += '<button class="ob" data-n="' + q.n + '" data-j="' + j + '" onclick="AKX.mark(' + q.n + ',' + j + ')">' + lab(j, q.n, q.opts) + '</button>';
      h += '</div>';
    });
    return h;
  }
  function optsHTML(q, review) {
    var h = '', sel = S.ans[S.si + ':' + q.n];
    var cls = function (j) {
      if (review) return j === q.a ? 'ok' : (j === sel ? 'ng' : '');
      return j === sel ? 'on' : '';
    };
    var clickable = review ? '' : ' onclick="AKX.mark(' + q.n + ',JJ)"';
    if (q.opts && q.opts.length && !(q.q && q.q.audioOnly)) {
      var long = q.opts.some(function (o) { return String(o).length > 34; });
      h += '<div class="op' + (long ? ' one' : '') + '">';
      q.opts.forEach(function (o, j) { h += '<button class="' + cls(j) + '" data-n="' + q.n + '" data-j="' + j + '"' + clickable.replace('JJ', j) + '>' + (o === '✓' || o === '✗' ? '' : '(' + lab(j, q.n, q.opts) + ') ') + rich(o) + '</button>'; });
      h += '</div>';
    } else {
      h += '<div class="mark">';
      for (var j = 0; j < q.oc; j++) h += '<button class="' + cls(j) + '" data-n="' + q.n + '" data-j="' + j + '"' + clickable.replace('JJ', j) + '>' + lab(j, q.n, q.opts) + '</button>';
      h += '</div>';
    }
    return h;
  }
  function scriptHTML(lines) {
    return '<div class="scr"><b>듣기 대본</b><br>' + (lines || []).map(function (l) { return '<b>' + esc(l.who || 'N') + '</b> ' + esc(l.t); }).join('<br>') + '</div>';
  }
  function itemHTML(sec, p, it, review) {
    var h = '';
    if (p.type === 'set') {
      var n0 = it._n0, n1 = n0 + it.qs.length - 1;
      var listen = !!it.script;
      h += '<div class="q" id="akxQ' + n0 + '"><p class="num" style="color:#0A5C3D">' + (D.exam === 'jlpt' && listen ? n0 + '番' : (n1 > n0 ? 'Questions ' + n0 + '–' + n1 : n0 + '.')) + '</p>';
      if (it.graphic) h += '<div class="psg">' + it.graphic + '</div>';
      (it.passages || []).forEach(function (ps) { h += '<div class="psg">' + (ps.title ? '<h5>' + esc(ps.title) + '</h5>' : '') + rich(ps.body) + '</div>'; });
      if (review && listen) h += scriptHTML(it.script);
      it.qs.forEach(function (q, k) {
        var Q = sec._qs.filter(function (x) { return x.n === n0 + k; })[0];
        var qt = q.audioOnly ? '' : rich(q.q || '');
        h += '<div class="q" id="akxQ' + (n0 + k) + '"><p><span class="num">' + (n0 + k) + '.</span>' + (qt || (listen ? '<span style="color:#5A4E42">(질문은 음성으로 나옵니다)</span>' : '')) + '</p>' + optsHTML(Q, review);
        if (review) { if (q.audioOnly && q.say) h += scriptHTML(q.say); h += '<div class="ex">' + rich(q.ex) + '</div>'; }
        h += '</div>';
      });
      h += '</div>';
      return h;
    }
    var Q = sec._qs.filter(function (x) { return x.n === it._n; })[0];
    h += '<div class="q" id="akxQ' + it._n + '">';
    if (p.type === 'photo') h += '<p><span class="num">' + it._n + '.</span></p><img class="pic" src="' + esc(it.img) + '" alt="">' + optsHTML(Q, review);
    else if (p.type === 'qr') h += '<p><span class="num">' + it._n + '.</span>' + (it.pre ? rich(it.pre) : (D.exam === 'toeic' ? 'Mark your answer on your answer sheet.' : '')) + '</p>' + optsHTML(Q, review);
    else if (p.type === 'match') h += '<p><span class="num">' + it._n + '.</span>' + (it.q ? rich(it.q) : '<span style="color:#5A4E42">(대화를 듣고 고르세요)</span>') + '</p>' + optsHTML(Q, review);
    else if (p.type === 'input') {
      var v = S.txt[S.si + ':' + it._n] || '';
      if (it.img) h += '<img class="pic" style="max-width:360px" src="' + esc(it.img) + '" alt="">';
      h += '<p><span class="num">' + it._n + '.</span>' + rich(it.q) + '</p><input class="inp' + (review ? (Q._ok ? ' ok' : ' ng') : '') + '" ' + (review ? 'disabled ' : '') + 'value="' + esc(v) + '" oninput="AKX.typed(' + it._n + ',this.value)" autocomplete="off" autocapitalize="off" spellcheck="false">';
      if (review) h += '<div class="ex">정답: <b>' + esc((it.ans || []).join(' / ')) + '</b><br>' + rich(it.ex) + '</div>';
      return h + '</div>';
    }
    else h += '<p><span class="num">' + it._n + '.</span>' + blankify(it.q) + '</p>' + optsHTML(Q, review);
    if (review) {
      if (it.say && (p.type === 'photo' || p.type === 'qr' || p.type === 'match' || D.exam === 'hsk')) h += scriptHTML(it.say);
      h += '<div class="ex">' + rich(it.ex) + '</div>';
    }
    return h + '</div>';
  }
  function partHead(p) {
    var h = '<div class="ph"><b>' + esc(p.name) + '</b>' + esc(p.dir || '') + '</div>';
    if (p.type === 'match' && p.imgs) { h += '<div class="imgs">' + p.imgs.map(function (s, j) { return '<figure><img src="' + esc(s) + '" alt=""><figcaption>' + 'ABCDEF'.charAt(j) + '</figcaption></figure>'; }).join('') + '</div>'; }
    if (p.type === 'match' && p.opts) { h += '<div class="opts">' + p.opts.map(function (s, j) { return '<b>' + 'ABCDEF'.charAt(j) + '</b> ' + rich(s); }).join('<br>') + '</div>'; }
    return h;
  }
  function bookHTML(sec, review) {
    var h = '', lastName = '';
    sec.parts.forEach(function (p) {
      if (p.name !== lastName || p.type === 'match') h += partHead(p); lastName = p.name;
      (p.items || []).forEach(function (it) { h += itemHTML(sec, p, it, review); });
    });
    return h;
  }
  function paintBooklet(sec) {
    var listen = sec.audio && (sec.key === 'LC' || sec.key === 'L');
    var right = listen ? '' : '<button onclick="AKX.submitSec()">' + (D.sections[S.si + 1] ? '이 영역 끝내기' : '제출') + '</button>';
    shell(bar(sec, right) + '<div class="main"><div class="bk" id="akxBk">' + wm() + bookHTML(sec, false) + '</div><div class="omr" id="akxOmr">' + omrHTML(sec) + '</div></div>');
    refreshMarks();
  }
  function refreshMarks() {
    var sec = D.sections[S.si]; if (!sec || !sec._qs) return; var c = 0;
    document.querySelectorAll('#akx [data-n]').forEach(function (b) {
      var on = S.ans[S.si + ':' + b.getAttribute('data-n')] === +b.getAttribute('data-j');
      b.classList.toggle('on', on);
    });
    sec._qs.forEach(function (q) { if (S.ans[S.si + ':' + q.n] != null || (S.txt[S.si + ':' + q.n] || '').trim()) c++; });
    var e = $('akxCnt'); if (e) e.textContent = c;
  }
  A.mark = function (n, j) { if (S.done) return; S.ans[S.si + ':' + n] = j; refreshMarks(); };
  A.typed = function (n, v) { S.txt[S.si + ':' + n] = v; refreshMarks(); };

  function countdown(sec, secs, onEnd) {
    var end = Date.now() + secs * 1000, warned = false;
    var f = function () {
      var left = (end - Date.now()) / 1000, e = $('akxTm');
      if (e) { e.textContent = mmss(left); e.classList.toggle('warn', left <= 300); }
      if (!warned && left <= 300 && secs > 600) { warned = true; beep(520, 300); }
      if (left <= 0) { clearInterval(TICK); TICK = null; onEnd(); }
    };
    if (TICK) clearInterval(TICK); TICK = setInterval(f, 250); f();
  }
  function readRun(sec) {
    countdown(sec, sec.time || 1800, function () { beep(440, 600); between(S.si); });
  }
  A.submitSec = function () {
    var sec = D.sections[S.si], left = 0;
    sec._qs.forEach(function (q) { if (q.kind !== 'speak' && S.ans[S.si + ':' + q.n] == null && !(S.txt[S.si + ':' + q.n] || '').trim()) left++; });
    var last = !D.sections[S.si + 1];
    confirmBox((left ? '아직 <b>' + left + '문항</b>을 풀지 않았습니다.<br>' : '') + (last ? '제출하면 바로 채점합니다.' : '이 영역을 끝내면 다시 돌아올 수 없습니다.'), last ? '제출' : '끝내기', function () { between(S.si); });
  };

  /* 듣기: 한 번만, 멈춤 없음 */
  function listenRun(sec) {
    AU = new Audio(sec.audio.src + '?v=' + VER); AU.preload = 'auto';
    var cues = sec.audio.cues || [], cur = -1, dur = sec.audio.dur;
    AU.ontimeupdate = function () {
      var t = AU.currentTime, e = $('akxTm'); if (e) e.textContent = mmss((AU.duration || dur) - t);
      var k = -1; for (var i = 0; i < cues.length; i++) if (cues[i].t <= t + .05) k = i;
      if (k !== cur && k >= 0) {
        cur = k; var n = cues[k].n;
        document.querySelectorAll('#akx .q.cur,#akx .orow.cur').forEach(function (x) { x.classList.remove('cur'); });
        var el = $('akxQ' + n), o = $('akxO' + n);
        if (el) { el.classList.add('cur'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        if (o) { o.classList.add('cur'); o.scrollIntoView({ block: 'nearest' }); }
      }
    };
    AU.onpause = function () { if (!AU.ended && !S.done && S.si === D.sections.indexOf(sec)) setTimeout(function () { try { AU.play(); } catch (e) { } }, 300); };
    AU.onended = function () { AU.onpause = null; setTimeout(function () { between(D.sections.indexOf(sec)); }, 1500); };
    AU.onerror = function () { var e = $('akxTm'); if (e) e.textContent = '음성 오류'; };
    var p = AU.play(); if (p && p.catch) p.catch(function () {
      confirmBox('듣기 음성을 시작하려면 아래 버튼을 눌러 주세요.', '듣기 시작', function () { AU.play(); });
    });
  }

  /* ───────── 말하기 (토익스피킹 · OPIc) ───────── */
  function speakStart(sec) {
    S.sp = { list: sec._qs.slice(), k: 0 };
    if (!AU) { AU = new Audio(); }
    AU = new Audio(sec.audio.src + '?v=' + VER); AU.preload = 'auto';
    if (D.exam === 'opic') countdownTotal(sec.time || 2400);
    speakItem();
  }
  function countdownTotal(secs) { S.opEnd = Date.now() + secs * 1000; }
  function playSeg(seg, times, cb) {
    var n = 0;
    var go = function () {
      AU.currentTime = seg[0]; var p = AU.play(); if (p && p.catch) p.catch(function () { });
      var iv = setInterval(function () {
        if (AU.currentTime >= seg[1] - 0.05 || AU.ended) { clearInterval(iv); AU.pause(); n++; if (n < times) setTimeout(go, 700); else cb(); }
      }, 80);
      S._iv = iv;
    };
    if (AU.readyState >= 1) go(); else { AU.onloadedmetadata = function () { AU.onloadedmetadata = null; go(); }; AU.load(); }
  }
  function spkScreen(q, statHTML) {
    var it = q.it, sec = D.sections[S.si], idx = S.sp.k + 1, tot = S.sp.list.length;
    var body = '';
    if (it.task === 'read') body = '<div class="rtext">' + rich(it.text) + '</div>';
    else if (it.task === 'picture') body = '<img class="pic" style="max-width:640px;margin:0 auto" src="' + esc(it.img) + '" alt="">';
    else if (it.task === 'info') body = '<div class="psg">' + it.info + '</div>';
    else if (it.task === 'opic') body = '<div class="sayb" style="justify-content:flex-start"><img src="img/sgi_talk.png" alt=""><div style="font-size:16px">Ava 질문 ' + idx + ' / ' + tot + '<br><span style="font-size:13.5px;font-weight:700">질문을 잘 듣고 자유롭게 답하세요. 권장 1분 30초~2분</span></div></div>';
    else body = '<div class="psg" style="font-size:16px;font-weight:800">' + esc(it.q ? '질문은 음성으로만 나옵니다.' : '') + '</div>';
    var right = '<button onclick="AKX.close()">나가기</button>';
    shell(bar(sec, right) + '<div class="spk">' + wm() + '<div class="box"><div class="ph"><b>' + (D.exam === 'tos' ? 'Question ' + q.n + ' of ' + tot : 'Question ' + idx) + '</b>' + esc((D.sections[S.si].parts[q.pi] || {}).name || '') + '</div>' + body + '</div><div id="akxStat" style="width:100%;display:flex;flex-direction:column;align-items:center">' + (statHTML || '') + '</div></div>');
    if (D.exam === 'opic') opTick();
  }
  function opTick() {
    if (TICK) clearInterval(TICK);
    TICK = setInterval(function () { var l = (S.opEnd - Date.now()) / 1000, e = $('akxTm'); if (e) { e.textContent = mmss(l); e.classList.toggle('warn', l < 300); } if (l <= 0) { clearInterval(TICK); TICK = null; stopRec(); finish(); } }, 500);
  }
  function stat(kind, secs, cb) {
    var box = $('akxStat'); if (!box) return;
    box.innerHTML = '<div class="stat' + (kind === 'RESPONSE TIME' ? ' resp' : '') + '"><b>' + kind + '</b><strong id="akxSt">' + mmss(secs) + '</strong><div class="gauge"><i id="akxGa"></i></div></div>';
    var end = Date.now() + secs * 1000;
    if (S._st) clearInterval(S._st);
    S._st = setInterval(function () {
      var l = (end - Date.now()) / 1000; var e = $('akxSt'), g = $('akxGa');
      if (e) e.textContent = mmss(l); if (g) g.style.width = Math.min(100, 100 * (1 - l / secs)) + '%';
      if (l <= 0) { clearInterval(S._st); S._st = null; cb(); }
    }, 100);
    if (D.exam === 'tos') { var e0 = $('akxTm'); if (e0) e0.textContent = mmss(secs); }
  }
  function startRec(n) {
    if (!STREAM || !window.MediaRecorder) return;
    try { var ch = []; REC = new MediaRecorder(STREAM); REC.ondataavailable = function (e) { if (e.data && e.data.size) ch.push(e.data); }; REC.onstop = function () { S.rec[n] = URL.createObjectURL(new Blob(ch, { type: REC.mimeType || 'audio/webm' })); }; REC.start(); } catch (e) { REC = null; }
  }
  function stopRec() { try { if (REC && REC.state === 'recording') REC.stop(); } catch (e) { } }
  function speakItem() {
    var q = S.sp.list[S.sp.k]; if (!q) return finish();
    var it = q.it;
    var after = function () {
      if (D.exam === 'opic') return opicAnswer(q);
      beep(880, 300);
      spkScreen(q, ''); stat('PREPARATION TIME', it.prep || 3, function () {
        beep(988, 350); startRec(q.n);
        stat('RESPONSE TIME', it.resp || 15, function () { stopRec(); beep(660, 300); S.sp.k++; setTimeout(speakItem, 900); });
      });
    };
    spkScreen(q, '<div class="stat"><b>LISTEN</b><strong>🔊</strong></div>');
    var go = function () { if (it.au) playSeg(it.au, it.repeat || 1, after); else after(); };
    if (it.readTime) { stat('READING TIME', it.readTime, go); }
    else go();
  }
  function opicAnswer(q) {
    var it = q.it; S._rp = S._rp || {};
    var box = $('akxStat');
    box.innerHTML = '<div class="stat resp"><b>답변 중 · 녹음</b><strong id="akxSt">00:00</strong><div class="gauge"><i id="akxGa"></i></div></div>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">' + (S._rp[q.n] ? '' : '<button class="no" id="akxRp">🔁 질문 다시 듣기 (1회)</button>') + '<button class="go" style="min-width:160px;height:50px;font-size:17px" id="akxNx">다음 ▶</button></div>';
    startRec(q.n); var t0 = Date.now();
    if (S._st) clearInterval(S._st);
    S._st = setInterval(function () { var s = (Date.now() - t0) / 1000, e = $('akxSt'), g = $('akxGa'); if (e) e.textContent = mmss(s); if (g) g.style.width = Math.min(100, s / 120 * 100) + '%'; }, 250);
    var rp = $('akxRp'); if (rp) rp.onclick = function () { S._rp[q.n] = 1; rp.remove(); stopRec(); playSeg(it.au, 1, function () { startRec(q.n); }); };
    $('akxNx').onclick = function () {
      clearInterval(S._st); stopRec(); S.sp.k++;
      if (D.meta && D.meta.readjustAfter && S.sp.k === D.meta.readjustAfter && !S.lv) return readjust();
      setTimeout(speakItem, 500);
    };
  }
  function readjust() {
    var box = $('akxStat');
    box.innerHTML = '<div class="stat"><b>난이도 재조정</b><div style="font-size:15px;font-weight:800;margin:6px 0 10px">지금부터 나올 질문의 난이도를 고르세요.</div><div class="lv"><button onclick="AKX.lv(1)">쉬운 질문</button><button onclick="AKX.lv(2)">비슷한 질문</button><button onclick="AKX.lv(3)">어려운 질문</button></div></div>';
  }
  A.lv = function (v) { S.lv = v; speakItem(); };

  A._dbg = function () { return { D: D, S: S }; };
  /* ───────── 채점 ───────── */
  function norm(t) { return String(t || '').replace(/[\s。．.，,！!？?、“”"'‘’：:；;]/g, ''); }
  function grade() {
    var R = [];
    D.sections.forEach(function (sec, si) {
      var ok = 0, tot = 0;
      sec._qs.forEach(function (q) {
        if (q.kind === 'speak') return; tot++;
        if (q.kind === 'input') {
          var v = norm(S.txt[si + ':' + q.n]);
          var good = (q.ans || []).some(function (a) { return norm(a) === v; });
          if (!good && /第二部分/.test((sec.parts[q.pi] || {}).name || '') && D.level === '5급') { good = v.length >= 60; }
          if (!good && /第二部分/.test((sec.parts[q.pi] || {}).name || '') && D.level === '4급') { /* 사진 작문: 제시어 포함 + 6자 이상이면 인정(추정 채점) */
            var kw = String(q.it.q || '').replace(/[^一-鿿]/g, ''); good = v.length >= 6 && kw && v.indexOf(kw) >= 0;
          }
          q._ok = good; if (good) ok++;
        } else { q._ok = S.ans[si + ':' + q.n] === q.a; if (q._ok) ok++; }
      });
      R.push({ name: sec.name, key: sec.key, ok: ok, tot: tot });
    });
    return R;
  }
  function toeicScale(r, key) { /* 정답 수 → 예상 점수 (추정 환산표) */
    var x = r / 100, s;
    if (key === 'LC') s = x <= .1 ? 5 + x * 200 : (x >= .96 ? 495 : 25 + (x - .1) * 548);
    else s = x <= .1 ? 5 + x * 150 : (x >= .97 ? 495 : 20 + (x - .1) * 548);
    return Math.max(5, Math.min(495, Math.round(s / 5) * 5));
  }
  function scoreLine(R) {
    if (D.exam === 'toeic') {
      var lc = R.filter(function (r) { return r.key === 'LC'; })[0], rc = R.filter(function (r) { return r.key === 'RC'; })[0];
      var a = toeicScale(lc.ok, 'LC'), b = toeicScale(rc.ok, 'RC');
      return { big: (a + b) + '점', sub: 'LC ' + a + ' · RC ' + b + ' (예상 점수 — 정답 수로 환산한 추정치입니다)' };
    }
    if (D.exam === 'hsk') {
      var t = 0; R.forEach(function (r) { t += Math.round(r.ok / r.tot * 100); });
      return { big: t + ' / 300', sub: (t >= 180 ? '합격선(180) 넘음' : '합격선 180까지 ' + (180 - t) + '점') + ' · 영역별 정답률을 100점으로 환산한 추정치' };
    }
    if (D.exam === 'jlpt') {
      var n3 = D.level === 'N3', two = R.length === 2, sc = R.map(function (r, i) { return Math.round(r.ok / r.tot * (two && i === 0 ? 120 : 60)); });
      var tot = sc.reduce(function (a, b) { return a + b; }, 0) * (n3 ? 1 : 1);
      var pass = n3 ? 95 : 90; /* N4 90 · N3 95 · N2 90 */
      return { big: tot + ' / 180', sub: (tot >= pass ? '합격선(' + pass + ') 넘음' : '합격선 ' + pass + '까지 ' + (pass - tot) + '점') + ' · 영역별 정답률을 60점으로 환산한 추정치(과락 기준은 실제 시험에서 확인)' };
    }
    return { big: '', sub: '' };
  }
  function finish() {
    stopAll(); S.done = true; window.onbeforeunload = null;
    setTimeout(function () { renderResult(); }, 400);
  }
  function renderResult() {
    var speak = D.exam === 'tos' || D.exam === 'opic';
    var h = '<div class="res">';
    if (!speak) {
      var R = grade(), L = scoreLine(R), tr = '';
      R.forEach(function (r) { tr += '<tr><td>' + esc(r.name) + '</td><td>' + r.ok + ' / ' + r.tot + '</td><td>' + Math.round(r.ok / Math.max(1, r.tot) * 100) + '%</td></tr>'; });
      h += '<div class="sayb"><img src="img/sgi_talk.png" alt=""><div>수고하셨습니다!<br><span style="font-size:15px;font-weight:700">틀린 문제는 해설을 꼭 읽고, 궁금한 건 제이영 원장님께 물어보세요.</span></div></div>'
        + '<div style="text-align:center"><div class="big">' + L.big + '</div><div class="note">' + esc(L.sub) + '</div></div>'
        + '<table class="sum"><tr><th>영역</th><th>정답</th><th>정답률</th></tr>' + tr + '</table>';
      D.sections.forEach(function (sec, si) { S.si = si; h += '<h3 style="margin:22px 0 8px;color:#0A5C3D">' + esc(sec.name) + ' · 해설</h3>' + bookHTML(sec, true); });
    } else {
      h += '<div class="sayb"><img src="img/sgi_talk.png" alt=""><div>수고하셨습니다!<br><span style="font-size:15px;font-weight:700">내 녹음과 모범답안을 나란히 들어 보세요. 말하기는 원장님 첨삭으로 점수가 가장 빨리 오릅니다.</span></div></div>';
      var sec = D.sections[0];
      sec._qs.forEach(function (q) {
        var it = q.it;
        h += '<div class="q"><div class="ph"><b>Question ' + q.n + (it.tag ? ' · ' + esc(it.tag) : '') + '</b>' + esc(it.q || '') + '</div>'
          + (S.rec[q.n] ? '<audio controls src="' + S.rec[q.n] + '" style="width:100%;max-width:520px"></audio>' : '<div class="note">녹음 없음 (마이크 미허용 또는 미지원 기기)</div>')
          + '<div class="scr"><b>모범답안</b><br>' + rich(it.model || '') + '</div><div class="ex">' + rich(it.tip || '') + '</div></div>';
      });
    }
    h += '<div style="text-align:center;margin:24px 0 60px"><button class="go" onclick="AKX.close(true)">닫기</button></div></div>';
    shell('<div class="bar"><div class="tt">' + esc(D.title) + '<small>결과 · 해설</small></div><div class="tm">끝</div><button onclick="AKX.close(true)">닫기</button></div><div class="main"><div class="bk">' + wm() + h + '</div></div>');
  }
})();
