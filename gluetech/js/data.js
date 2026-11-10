/* 글루테크 카탈로그 원본 수치 (브로셔 사진 기준) — 숫자는 여기서만 고친다 */
window.CATALOG={
 tank:{name:'탱크',en:'TANK',img:'img/tank_r30_hq.png',
  lead:'핫멜트를 녹여 일정한 온도로 유지하고 호스로 보냅니다. 앞면 컨트롤러로 온도를 조절합니다.',
  common:[['사용 호스','1 ~ 6 개'],['사용 온도','1 ~ 230 ℃']],
  models:[
   {code:'R-8',kg:8,mr:11,size:'600 × 337 × 512',kw:'3.5 / 4.5 / 5.5',img:'img/tank_r12.png'},
   {code:'R-12',kg:12,mr:16,size:'600 × 337 × 512',kw:'3.5 / 4.5 / 5.5',img:'img/tank_r12.png'},
   {code:'R-20',kg:20,mr:25,size:'675 × 445 × 591.4',kw:'5.5 / 6.5 / 7.5',img:'img/tank_r30_hq.png'},
   {code:'R-30',kg:30,mr:35,size:'675 × 445 × 591.4',kw:'5.5 / 6.5 / 7.5',img:'img/tank_r30_hq.png'},
   {code:'R-45',kg:45,mr:50,size:'755 × 520 × 690.1',kw:'7.5 / 8.5 / 9.5',img:'img/tank_r30_hq.png'},
   {code:'R-60',kg:60,mr:65,size:'755 × 520 × 690.1',kw:'7.5 / 8.5 / 9.5',img:'img/tank_r30_hq.png'}]},
 hose:{name:'히팅호스',en:'HOSE',img:'img/hose.png',
  lead:'녹은 접착제를 정확한 사용 온도로 유지하면서 건까지 이송합니다.',
  models:[{code:'HOSE',title:'히팅호스',img:'img/hose.png',spec:[['호스 내경','ø 7.5 ~ 25 mm'],['발열량','20 ~ 30 Watts / 1 ft (30 cm)'],['히터 종류','권선 히터'],['옵션','센서와 커넥터 교체로 모든 타입 가능'],['호스 길이','길이 조절 가능 (주문 제작)']]}]},
 nozzle:{name:'노즐',en:'NOZZLE',img:'img/nozzle_s.png',
  lead:'토출 모양을 정합니다. 노즐 구경은 0.1mm 단위로 제작합니다.',
  models:[
   {code:'S008 ~ S080',title:'S 노즐',img:'img/nozzle_s.png',spec:[['규격','13 × 13 mm 육각'],['특징','0.1 mm 단위 노즐 구경 제작']]},
   {code:'M1200 ~ M0800',title:'M 노즐',img:'img/nozzle_m.png',spec:[['규격','12 × 12 mm 육각'],['특징','0.1 mm 단위 노즐 구경 제작 / 분사 각도 조절']]}]},
 module:{name:'모듈',en:'MODULE',img:'img/mod_ma002.png',
  lead:'에어 솔레노이드 밸브로 작동하며 분사량을 조절합니다.',
  models:[
   {code:'MA001',title:'모듈 MA001',img:'img/mod_ma001.png',spec:[['작동 방식','에어 솔레노이드 밸브'],['특징','분사량 조절 가능']]},
   {code:'MA002',title:'모듈 MA002',img:'img/mod_ma002.png',spec:[['작동 방식','에어 솔레노이드 밸브'],['특징','Spiral pattern 분사 / 분사량 조절 가능']]}]},
 gun:{name:'오토건',en:'AUTO GUN',img:'img/gun.png',
  lead:'용융된 접착제를 정밀하게 분사합니다. RPT 센서로 온도를 제어합니다.',
  models:[
   {code:'GA-101',title:'오토건 GA-101',img:'img/gun.png',spec:[['정격 전압','1Ø, 220V AC, 200 Watts'],['온도 제어','RPT 센서'],['예열 시간','5 ~ 7 분'],['작동 방식','Air solenoid valve']]},
   {code:'GSA-101',title:'오토건 GSA-101',img:'img/gun.png',spec:[['정격 전압','1Ø, 220V AC, 400 Watts'],['온도 제어','RPT 센서'],['예열 시간','7 ~ 10 분'],['작동 방식','Air solenoid valve']]}]}
};
window.CAT_ORDER=['tank','hose','nozzle','module','gun'];
