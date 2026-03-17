const fs = require('fs');
const html = fs.readFileSync('career-test.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
let js = scriptMatch[1];

// DOM mock
const mockEl = {innerHTML:'',textContent:'',style:{width:''},classList:{add:()=>{},remove:()=>{},toggle:()=>{},contains:()=>false},querySelectorAll:()=>[],querySelector:()=>null,children:[]};
global.document = {getElementById:()=>({...mockEl}),querySelectorAll:()=>[],querySelector:()=>null,addEventListener:()=>{}};
global.window = {scrollTo:()=>{},open:()=>({document:{write:()=>{},close:()=>{}}}),print:()=>{}};
global.navigator = {clipboard:{writeText:()=>Promise.resolve()}};

// goScreen 등 UI 함수를 no-op으로
js = js.replace(/goScreen\([^)]+\)/g, '/* goScreen */');
js = js.replace(/window\.scrollTo\([^)]+\)/g, '');

// eval
try { eval(js); } catch(e) { /* DOM 에러 무시 */ }

// 페르소나 10개
const personas = [
  { name:'김서연 (문과, 영업 지망)', profile:['none'], mbti:'ESFJ',
    q3:['q3_11','q3_12','q3_14'], q4:['q4_10','q4_15','q4_8'],
    scenario:[{competency:['傾聴力','共感力']},{competency:['傾聴力','共感力']},{competency:['調整力','自己管理能力']},{competency:['傾聴力','洞察力']},{competency:['傾聴力','共感力']},{competency:['傾聴力','柔軟性']},{competency:['実行力','状況把握力']},{competency:['傾聴力','調整力']}],
    episode:['ep_5','ep_11','ep_9'], q5a:['q5a_1'], q5b:['q5b_9'],
    expectedJob:'영업', expectedNot:'SE/IT' },

  { name:'박준호 (이공계+IT, SE 지망)', profile:['engineering','it'], mbti:'INTP',
    q3:['q3_1','q3_2','q3_5'], q4:['q4_1','q4_2','q4_6'],
    scenario:[{competency:['実行力','責任感']},{competency:['論理的思考力','冷静さ']},{competency:['論理的思考力','洞察力']},{competency:['傾聴力','洞察力']},{competency:['論理的思考力','洞察力']},{competency:['論理的思考力','自己管理能力']},{competency:['冷静さ','論理的思考力']},{competency:['企画力','自己管理能力']}],
    episode:['ep_8','ep_10','ep_2'], q5a:['q5a_2'], q5b:['q5b_6'],
    expectedJob:'SE/IT', expectedNot:'판매/서비스' },

  { name:'이하은 (영어+유학, 기획 지망)', profile:['english','overseas'], mbti:'ENFP',
    q3:['q3_15','q3_4','q3_7'], q4:['q4_3','q4_5','q4_4'],
    scenario:[{competency:['牽引力','企画力']},{competency:['実行力','積極性']},{competency:['創造力','企画力']},{competency:['調整力','柔軟性']},{competency:['企画力','積極性']},{competency:['傾聴力','柔軟性']},{competency:['発信力','積極性']},{competency:['発信力','牽引力']}],
    episode:['ep_6','ep_4','ep_7'], q5a:['q5a_3'], q5b:[],
    expectedJob:'기획/관리', expectedNot:'시공관리' },

  { name:'최민수 (영어, 컨설팅 지망)', profile:['english'], mbti:'ENTJ',
    q3:['q3_1','q3_8','q3_10'], q4:['q4_2','q4_9','q4_11'],
    scenario:[{competency:['牽引力','企画力']},{competency:['論理的思考力','冷静さ']},{competency:['論理的思考力','洞察力']},{competency:['牽引力','企画力']},{competency:['論理的思考力','洞察力']},{competency:['論理的思考力','自己管理能力']},{competency:['牽引力','調整力']},{competency:['発信力','牽引力']}],
    episode:['ep_4','ep_8','ep_6'], q5a:[], q5b:['q5b_1'],
    expectedJob:'컨설팅', expectedNot:'판매/서비스' },

  { name:'정유진 (이공계, 기술계 지망)', profile:['engineering'], mbti:'ISTJ',
    q3:['q3_6','q3_5','q3_2'], q4:['q4_14','q4_6','q4_1'],
    scenario:[{competency:['実行力','責任感']},{competency:['論理的思考力','冷静さ']},{competency:['論理的思考力','洞察力']},{competency:['傾聴力','洞察力']},{competency:['実行力','粘り強さ']},{competency:['粘り強さ','実行力']},{competency:['冷静さ','論理的思考力']},{competency:['企画力','自己管理能力']}],
    episode:['ep_10','ep_2','ep_12'], q5a:['q5a_2','q5a_5'], q5b:['q5b_5'],
    expectedJob:'기술계', expectedNot:'영업' },

  { name:'김도윤 (문과, 물류 지망)', profile:['none'], mbti:'ISFJ',
    q3:['q3_5','q3_6','q3_9'], q4:['q4_6','q4_16','q4_7'],
    scenario:[{competency:['実行力','責任感']},{competency:['状況把握力','責任感']},{competency:['調整力','自己管理能力']},{competency:['状況把握力','共感力']},{competency:['実行力','粘り強さ']},{competency:['論理的思考力','自己管理能力']},{competency:['実行力','状況把握力']},{competency:['企画力','自己管理能力']}],
    episode:['ep_12','ep_2','ep_9'], q5a:['q5a_5'], q5b:['q5b_4'],
    expectedJob:'물류/SCM', expectedNot:'컨설팅' },

  { name:'한소희 (문과, 판매서비스 지망)', profile:['none'], mbti:'ESFP',
    q3:['q3_12','q3_14','q3_16'], q4:['q4_10','q4_15','q4_13'],
    scenario:[{competency:['傾聴力','共感力']},{competency:['傾聴力','共感力']},{competency:['積極性','実行力']},{competency:['状況把握力','共感力']},{competency:['傾聴力','共感力']},{competency:['傾聴力','柔軟性']},{competency:['実行力','状況把握力']},{competency:['柔軟性','協調性']}],
    episode:['ep_5','ep_9','ep_11'], q5a:['q5a_1'], q5b:[],
    expectedJob:'판매/서비스', expectedNot:'SE/IT' },

  { name:'장현우 (이공계, 시공관리 지망)', profile:['engineering'], mbti:'ESTP',
    q3:['q3_16','q3_6','q3_9'], q4:['q4_13','q4_8','q4_7'],
    scenario:[{competency:['実行力','責任感']},{competency:['実行力','積極性']},{competency:['積極性','実行力']},{competency:['牽引力','企画力']},{competency:['実行力','粘り強さ']},{competency:['粘り強さ','実行力']},{competency:['実行力','状況把握力']},{competency:['発信力','牽引力']}],
    episode:['ep_9','ep_2','ep_3'], q5a:[], q5b:['q5b_6'],
    expectedJob:'시공관리', expectedNot:'크리에이티브' },

  { name:'윤서아 (문과, 크리에이티브 지망)', profile:['none'], mbti:'INFP',
    q3:['q3_7','q3_15','q3_4'], q4:['q4_5','q4_3','q4_4'],
    scenario:[{competency:['傾聴力','調整力']},{competency:['傾聴力','共感力']},{competency:['創造力','企画力']},{competency:['傾聴力','洞察力']},{competency:['企画力','積極性']},{competency:['洞察力','冷静さ']},{competency:['発信力','積極性']},{competency:['柔軟性','協調性']}],
    episode:['ep_6','ep_10','ep_7'], q5a:['q5a_1'], q5b:['q5b_7'],
    expectedJob:'크리에이티브', expectedNot:'SE/IT' },

  { name:'오진석 (문과, 안정 지향 종합)', profile:['none'], mbti:'ISTJ',
    q3:['q3_6','q3_5','q3_13'], q4:['q4_6','q4_12','q4_7'],
    scenario:[{competency:['調整力','柔軟性']},{competency:['状況把握力','責任感']},{competency:['調整力','自己管理能力']},{competency:['調整力','柔軟性']},{competency:['論理的思考力','洞察力']},{competency:['論理的思考力','自己管理能力']},{competency:['冷静さ','論理的思考力']},{competency:['企画力','自己管理能力']}],
    episode:['ep_1','ep_12','ep_2'], q5a:['q5a_2','q5a_5'], q5b:['q5b_5','q5b_4'],
    expectedJob:'기획/관리', expectedNot:'영업' }
];

console.log('═══════════════════════════════════════════════════════════════');
console.log(' 커리어 나침반 v2 — 10 페르소나 시뮬레이션');
console.log('═══════════════════════════════════════════════════════════════\n');

let pass=0, fail=0, issues=[];

personas.forEach((p,pi) => {
  state = { profile:p.profile, mbti:p.mbti, axisScores:{}, q3:p.q3, q4:p.q4, scenario:p.scenario, episode:p.episode, q5a:p.q5a, q5b:p.q5b, situation:{}, selectedIndustries:[], result:null };

  const compScores = computeCompetencyScores();
  const jobScores = computeJobScores(compScores);
  const filtered = applyHardFilters(jobScores);
  const topJobs = getTopJobs(filtered, 3);

  const selfScores = computeSelfAwarenessScores();
  const behScores = computeBehaviorScores();
  const selfTop3 = Object.entries(selfScores).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([n])=>n);
  const behTop3 = Object.entries(behScores).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([n])=>n);
  const matched = selfTop3.filter(c => behTop3.includes(c));

  const isExp = topJobs.includes(p.expectedJob);
  const isNotBad = !topJobs.includes(p.expectedNot);
  const ok = isExp && isNotBad;
  if(ok) pass++; else { fail++; issues.push({name:p.name,expected:p.expectedJob,got:topJobs,notWant:p.expectedNot}); }

  const topC = Object.entries(compScores).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const CK={'論理的思考力':'논리적사고','洞察力':'통찰','創造力':'창조','企画力':'기획','冷静さ':'냉정','積極性':'적극','粘り強さ':'끈기','実行力':'실행','自己管理能力':'자기관리','状況把握力':'상황파악','発信力':'발신','傾聴力':'경청','共感力':'공감','牽引力':'견인','調整力':'조정','柔軟性':'유연','協調性':'협조','責任感':'책임감'};

  console.log(`${ok?'✅':'❌'} ${pi+1}. ${p.name}`);
  console.log(`   역량 TOP5: ${topC.map(([n,s])=>`${CK[n]||n}(${s})`).join(', ')}`);
  console.log(`   직종: ${topJobs.map((j,i)=>`${i+1}.${j}`).join(' / ')}`);
  console.log(`   기대: ${p.expectedJob}${isExp?' ✅':' ❌'} | 제외: ${p.expectedNot}${isNotBad?' ✅':' ❌'}`);
  console.log(`   교차검증: 자기[${selfTop3.map(c=>CK[c]||c).join(',')}] vs 행동[${behTop3.map(c=>CK[c]||c).join(',')}] 일치=${matched.length}/3`);
  const zero=Object.entries(filtered).filter(([,s])=>s===0).map(([j])=>j);
  if(zero.length) console.log(`   제거: ${zero.join(', ')}`);
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════════');
console.log(` 결과: ${pass}/10 통과, ${fail}/10 실패`);
if(issues.length) { console.log('\n문제 케이스:'); issues.forEach(i=>console.log(`  ${i.name}: 기대=${i.expected}, 결과=${i.got.join('/')}, 제외기대=${i.notWant}`)); }
console.log('═══════════════════════════════════════════════════════════════');
