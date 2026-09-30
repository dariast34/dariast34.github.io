import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/data.js', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const htmlSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const interactionCss = readFileSync(new URL('../interactions.css', import.meta.url), 'utf8');
const matchCss = readFileSync(new URL('../match.css', import.meta.url), 'utf8');
const wordSearchCss = readFileSync(new URL('../wordsearch.css', import.meta.url), 'utf8');
const themeCss = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const data = sandbox.window.GAME_DATA;
const staticGameIds = Array.from(appSource.matchAll(/^\s*\{id:'([^']+)'/gm), match => match[1]);
const gameIds = [...staticGameIds,...data.microGames.map(pack=>pack.id)];

function openNewGame(gameId){
  const elements=new Map();
  const makeElement=()=>({innerHTML:'',textContent:'',value:'',hidden:false,dataset:{},style:{},listeners:{},classList:{add(){},remove(){},toggle(){}},addEventListener(type,handler){this.listeners[type]=handler},querySelectorAll(selector){if(selector!=='[data-mission-choice]')return[];if(this._cachedMarkup!==this.innerHTML){this._cachedMarkup=this.innerHTML;this._missionButtons=Array.from(this.innerHTML.matchAll(/data-mission-choice="(\d+)">([^<]+)<\/button>/g),match=>({dataset:{missionChoice:match[1]},label:match[2],classList:{add(){}},disabled:false}))}return this._missionButtons},querySelector(){return makeElement()},setAttribute(){},showModal(){this.open=true},close(){this.open=false}});
  const document={querySelector(selector){if(!elements.has(selector))elements.set(selector,makeElement());return elements.get(selector)}};
  const context={window:{GAME_DATA:data},document,localStorage:{getItem(){return null},setItem(){},removeItem(){}},confirm(){return true},alert(){},setTimeout(){return 1},clearTimeout(){},Math};
  vm.runInNewContext(appSource,context);
  const grid=elements.get('#gameGrid');
  grid.listeners.click({target:{closest(){return{dataset:{game:gameId}}}}});
  return{dialog:elements.get('#gameDialog'),body:elements.get('#gameBody'),elements};
}

test('game catalog has 100 unique entries and every entry has a matching game runner', () => {
  assert.equal(gameIds.length, 100);
  assert.equal(new Set(gameIds).size, gameIds.length);
  for(const id of ['conditions','cipher','permissions','compression','web-page','rgb','license','accessibility','cloud','ai-check','gates','network-route']) assert.ok(gameIds.includes(id), `missing ${id}`);
  assert.equal(data.microGames.length,70);
  assert.match(appSource,/D\.microGames\.map\(pack=>\(\{id:pack\.id/,'micro-game packs should be connected to a shared runner');
});

test('puzzle filter groups order, sorting, riddles, matching and word-search games',()=>{
  const helper=appSource.match(/const puzzleGameIds=new Set\([^\n]+\);\nfunction gameGroup\(g\)\{[^\n]+\}/)?.[0];
  assert.ok(helper,'games need a shared topic/format classifier');
  const gameGroup=vm.runInNewContext(`${helper};gameGroup`);
  for(const format of ['order','sort','riddle','match','wordsearch'])assert.equal(gameGroup({format,topic:'WEB TASARIMI'}),'puzzles');
  for(const id of ['box','word','sequence','binary','memory','files','storage','loops','packets','pixels','conditions','cipher','compression','web-page','rgb','gates','network-route'])assert.equal(gameGroup({id,topic:'ALGORİTMA'}),'puzzles');
  assert.match(appSource,/format:pack\.kind/,'micro-game format must be available to filters');
  assert.match(htmlSource,/data-filter="puzzles"[^>]*>Bulmaca & eşleştirme/);
  assert.match(htmlSource,/<span data-filter-count="puzzles">0<\/span>/,'screen readers should announce the live puzzle count');
  assert.match(appSource,/data-filter-count="puzzles"/);
});

test('new game decks are shuffled without mutating their source data',()=>{
  const helper=appSource.match(/function shuffled\(items\)\{[^\n]+\}/)?.[0];
  assert.ok(helper,'shared Fisher–Yates helper should exist');
  const math=Object.create(Math);math.random=()=>0;
  const shuffle=vm.runInNewContext(`${helper};shuffled`,{Math:math});
  const original=['A','B','C','D'],result=shuffle(original);
  assert.deepEqual(Array.from(result).sort(),original);
  assert.notEqual(result,original);
  assert.deepEqual(original,['A','B','C','D']);
});

test('game dialog is named for assistive technology and page declares Turkish',()=>{
  assert.match(htmlSource,/<html lang="tr">/);
  assert.match(htmlSource,/<dialog[^>]*aria-labelledby="gameTitle"/);
  assert.match(htmlSource,/<b>100<\/b><span>özgün oyun<\/span>/);
  assert.match(htmlSource,/<input id="gameSearch" type="search"[^>]*aria-label="Oyun adı veya konusu ara"/);
  assert.match(htmlSource,/id="gameCount" aria-live="polite" aria-atomic="true"/);
  assert.match(htmlSource,/id="emptyGames" role="status" aria-live="polite"/);
  assert.match(appSource,/function filterGames\(\).*matchesGroup.*matchesText/s);
  assert.match(htmlSource,/id="surpriseGame" type="button"/);
  assert.match(appSource,/if\(available\.length\)openGame/);
});

test('the game site stays static and does not request remote scripts or collect personal data',()=>{
  assert.doesNotMatch(htmlSource,/<(?:script|iframe|img)[^>]+(?:src|href)=["']https?:/i);
  assert.doesNotMatch(`${appSource}\n${source}`,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|document\.cookie|navigator\.geolocation/i);
});

test('each extended learning game includes eight short missions',()=>{
  assert.equal(data.conditionMissions.length,8);
  assert.equal(data.cipherMissions.length,8);
  assert.equal(data.permissionMissions.length,8);
  assert.equal(data.compressionMissions.length,8);
  assert.equal(data.licenseMissions.length,8);
  assert.equal(data.accessMissions.length,8);
  assert.equal(data.cloudMissions.length,8);
  assert.equal(data.aiCheckMissions.length,8);
  for(const mission of [...data.conditionMissions,...data.cipherMissions,...data.permissionMissions,...data.compressionMissions,...data.licenseMissions,...data.accessMissions,...data.cloudMissions,...data.aiCheckMissions]){
    assert.equal(mission.options.length,3);
    assert.equal(new Set(mission.options).size,3);
    assert.ok(mission.ok>=0&&mission.ok<3);
    assert.ok(mission.why.trim());
  }
});

test('license game teaches attribution, share-alike, noncommercial and no-derivatives accurately',()=>{
  const lessons=data.licenseMissions.map(mission=>`${mission.scene} ${mission.options.join(' ')} ${mission.why}`).join(' ');
  for(const token of ['CC BY','SA','NC','ND','CC0','kaynak'])assert.ok(lessons.includes(token),`missing license concept: ${token}`);
  assert.ok(data.licenseMissions.some(mission=>/reklam/i.test(mission.scene)),'commercial use should be a cautious scenario');
  assert.ok(data.licenseMissions.some(mission=>mission.scene.includes('lisans bilgisi yok')),'unlicensed sources should not be assumed free');
});

test('new scenarios teach accessibility, careful cloud sharing and AI verification',()=>{
  const access=data.accessMissions.map(item=>`${item.scene} ${item.options.join(' ')} ${item.why}`).join(' ');
  const cloud=data.cloudMissions.map(item=>`${item.scene} ${item.options.join(' ')} ${item.why}`).join(' ');
  const ai=data.aiCheckMissions.map(item=>`${item.scene} ${item.options.join(' ')} ${item.why}`).join(' ');
  for(const token of ['altyazı','alternatif metin','kontrast','klavye odağı','renge'])assert.ok(access.toLocaleLowerCase('tr').includes(token),`missing accessibility concept: ${token}`);
  for(const token of ['çevrimdışı','görüntüleme izni','eşitlenebilir','senkronizasyon'])assert.ok(cloud.toLocaleLowerCase('tr').includes(token),`missing cloud concept: ${token}`);
  for(const token of ['doğrula','kişisel','önyargı','gerçek diye paylaşmam'])assert.ok(ai.toLocaleLowerCase('tr').includes(token),`missing AI literacy concept: ${token}`);
});

test('logic gate missions have a valid switch solution and correct truth-table behavior',()=>{
  assert.equal(data.gateMissions.length,8);
  const helper=appSource.match(/function gateOutput\(gate,a,b\)\{[^\n]+\}/)?.[0];
  assert.ok(helper,'logic gate evaluator should be independently testable');
  const gateOutput=vm.runInNewContext(`${helper};gateOutput`);
  assert.deepEqual(['AND','OR','NOT','XOR'].map(gate=>[gateOutput(gate,0,0),gateOutput(gate,0,1),gateOutput(gate,1,0),gateOutput(gate,1,1)]),[[0,0,0,1],[0,1,1,1],[1,1,0,0],[0,1,1,0]]);
  for(const mission of data.gateMissions){
    assert.ok(['AND','OR','NOT','XOR'].includes(mission.gate));
    assert.ok([0,1].includes(mission.target));
    assert.ok([0,1].some(a=>[0,1].some(b=>gateOutput(mission.gate,a,b)===mission.target)));
  }
  assert.match(appSource,/data-gate="a"/);
  assert.match(appSource,/aria-pressed/);
});

test('network route cards have clear endpoints and a valid device answer',()=>{
  assert.equal(data.routeMissions.length,8);
  for(const mission of data.routeMissions){
    assert.ok(mission.start&&mission.end&&mission.question&&mission.why);
    assert.equal(mission.options.length,3);
    assert.equal(new Set(mission.options).size,3);
    assert.ok(mission.ok>=0&&mission.ok<mission.options.length);
  }
  assert.match(appSource,/class="route-map"/);
  assert.match(appSource,/data-route-choice/);
});

test('all 70 micro-games have complete content and one of six supported accessible engines',()=>{
  assert.equal(data.microGames.length,70);
  const kinds=new Set(data.microGames.map(pack=>pack.kind));
  assert.deepEqual([...kinds].sort(),['choice','match','order','riddle','sort','wordsearch']);
  for(const pack of data.microGames){
    assert.ok(pack.title&&pack.desc&&pack.topic&&pack.icon&&pack.color);
    assert.ok(['choice','match','order','riddle','sort','wordsearch'].includes(pack.kind));
    assert.ok(pack.missions?.length||pack.items?.length||pack.pairs?.length||pack.terms?.length,`${pack.id} needs playable content`);
    if(pack.kind==='choice')for(const mission of pack.missions){assert.equal(mission.options.length,3);assert.ok(mission.ok>=0&&mission.ok<3);assert.ok(mission.why)}
    if(pack.kind==='order')for(const mission of pack.missions){assert.ok(mission.solution.length>=3);assert.equal(new Set(mission.solution).size,mission.solution.length);assert.ok(mission.scene&&mission.why)}
    if(pack.kind==='sort'){assert.ok(pack.categories.length>=2);assert.ok(pack.items.length>=4);for(const item of pack.items){assert.ok(pack.categories.includes(item.category));assert.ok(item.why)}}
    if(pack.kind==='match'){assert.ok(pack.pairs.length>=4);const labels=pack.pairs.flat();assert.equal(new Set(labels).size,labels.length,`${pack.id} has duplicate match cards`);for(const [term,meaning] of pack.pairs)assert.ok(term&&meaning&&term!==meaning)}
    if(pack.kind==='riddle')for(const mission of pack.missions)assert.ok(mission.clue&&mission.answer.length&&mission.answer.every(Boolean));
    if(pack.kind==='wordsearch'){assert.equal(pack.size,8);assert.ok(pack.terms.length>=6);const words=pack.terms.map(term=>term.word.toLocaleUpperCase('tr-TR'));assert.equal(new Set(words).size,words.length);assert.ok(words.every(word=>[...word].length<=pack.size));assert.ok(words.every((word,index)=>!words.some((other,otherIndex)=>index!==otherIndex&&(word.startsWith(other)||word.endsWith(other)))));for(const term of pack.terms)assert.ok(term.clue&&term.word)}
  }
  assert.match(appSource,/function runOrderPack/);
  assert.match(appSource,/function runSortPack/);
  assert.match(appSource,/function runRiddlePack/);
  assert.match(appSource,/function runMatchPack/);
  assert.match(appSource,/function runWordSearchPack/);
});

test('70 new packs cover varied topics and do not repeat game titles or prompts',()=>{
  assert.ok(new Set(data.microGames.map(pack=>pack.topic)).size>=15);
  assert.equal(new Set(data.microGames.map(pack=>pack.title)).size,data.microGames.length);
  const prompts=data.microGames.flatMap(pack=>[
    ...(pack.missions||[]).map(mission=>mission.scene||mission.clue),
    ...(pack.items||[]).map(item=>item.text)
  ].filter(Boolean));
  const duplicates=prompts.filter((prompt,index)=>prompts.indexOf(prompt)!==index);
  assert.equal(new Set(prompts).size,prompts.length,`game prompts and match cards should be distinct: ${duplicates.join(' | ')}`);
});

test('matching cards are touch-friendly, keyboard visible, responsive and reduced-motion aware',()=>{
  assert.match(htmlSource,/href="match\.css"/);
  assert.match(matchCss,/\.match-card\{min-height:88px/);
  assert.match(matchCss,/\.match-card:focus-visible/);
  assert.match(matchCss,/@media\(max-width:540px\).*grid-template-columns:repeat\(2/);
  assert.match(matchCss,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(appSource,/aria-pressed="false" aria-label="\$\{index\+1\}\. kapalı kart"/);
});

test('web word-search grid has readable touch cells, visible focus and mobile scrolling',()=>{
  assert.match(htmlSource,/href="wordsearch\.css"/);
  assert.match(wordSearchCss,/\.wordsearch-cell\{width:46px;height:46px/);
  assert.match(wordSearchCss,/\.wordsearch-cell:focus-visible/);
  assert.match(wordSearchCss,/\.wordsearch-scroll\{max-width:100%;overflow-x:auto/);
  assert.match(appSource,/data-word-cell/);
  assert.match(appSource,/aria-live="polite"/);
  assert.match(appSource,/ArrowUp:-size,ArrowDown:size,ArrowLeft:-1,ArrowRight:1/);
  assert.match(appSource,/Enter veya boşlukla seç/);
  assert.match(appSource,/tabindex="\$\{index===0\?'0':'-1'\}"/);
});

test('web page builder has ordered, unique components for multiple page types',()=>{
  assert.ok(data.pagePlans.length>=8);
  assert.equal(new Set(data.pagePlans.map(plan=>plan.title)).size,data.pagePlans.length);
  for(const plan of data.pagePlans){
    assert.ok(plan.blocks.length>=4);
    assert.ok(plan.blocks.length<=7);
    assert.equal(new Set(plan.blocks).size,plan.blocks.length);
    assert.equal(plan.blocks[0],'Üst gezinme');
    assert.equal(plan.blocks.at(-1),'Alt bilgi');
    assert.ok(plan.why.trim());
  }
  assert.match(appSource,/data-page-index/);
  assert.match(appSource,/function move\(offset\)/);
  const pageGame=appSource.slice(appSource.indexOf('function webPage(){'),appSource.indexOf('function rgbLab(){'));
  assert.match(pageGame,/order=deck\[0\]/,'initial shuffle should happen once before drawing the page');
  assert.match(pageGame,/round\+\+;order=deck\[round\]/,'a fresh order should be created only when advancing');
  assert.doesNotMatch(pageGame,/const item=deck\[round\];order=/,'redrawing after a move must preserve the learner\'s order');
});

test('RGB lab covers primary colors and valid binary light-channel targets',()=>{
  assert.equal(data.rgbMissions.length,8);
  const combinations=new Set(data.rgbMissions.map(mission=>mission.rgb.join(',')));
  assert.equal(combinations.size,8);
  const colors=new Set(data.rgbMissions.map(mission=>mission.name));
  for(const name of ['Kırmızı','Yeşil','Mavi','Beyaz','Siyah'])assert.ok(colors.has(name));
  for(const mission of data.rgbMissions){
    assert.equal(mission.rgb.length,3);
    assert.ok(mission.rgb.every(value=>value===0||value===255));
    assert.ok(mission.why.trim());
  }
  for(const red of [0,255])for(const green of [0,255])for(const blue of [0,255])assert.ok(combinations.has([red,green,blue].join(',')));
});

test('new controls remain touch-sized, responsive and respect reduced motion',()=>{
  assert.match(interactionCss,/\.page-controls button\{min-height:46px\}/);
  assert.match(interactionCss,/\.rgb-channel\{min-height:46px\}/);
  assert.match(interactionCss,/\.surprise-game\{min-height:46px/);
  assert.match(interactionCss,/@media\(max-width:420px\).*\.rgb-controls\{grid-template-columns:1fr\}/s);
  assert.match(themeCss,/@media\(max-width:540px\)/);
  assert.match(themeCss,/@media\(prefers-reduced-motion:reduce\)/);
});

test('every game in the catalog opens a populated game dialog',()=>{
  for(const id of gameIds){
    const {dialog,body}=openNewGame(id);
    assert.equal(dialog.open,true,`${id} should open the game dialog`);
    assert.ok(body.innerHTML.trim(),`${id} should render a game screen`);
  }
});

test('each new mission game starts with accessible answer controls',()=>{
  for(const id of ['conditions','cipher','permissions','compression','license','accessibility','cloud','ai-check','gates','network-route']){
    const {body}=openNewGame(id);
    const controlPattern=id==='gates'?/data-gate=/:id==='network-route'?/data-route-choice/:/data-mission-choice/;
    assert.match(body.innerHTML,controlPattern,`${id} should render answer controls`);
  }
});

test('each new mission game completes every correct-answer path exactly once',()=>{
  const decks={conditions:data.conditionMissions,cipher:data.cipherMissions,permissions:data.permissionMissions,compression:data.compressionMissions,license:data.licenseMissions,accessibility:data.accessMissions,cloud:data.cloudMissions,'ai-check':data.aiCheckMissions};
  for(const [id,deck] of Object.entries(decks)){
    const {body,elements}=openNewGame(id);
    deck.forEach((mission,index)=>{
      const rightLabel=mission.options[mission.ok];
      const button=body.querySelectorAll('[data-mission-choice]').find(candidate=>candidate.label===rightLabel);
      assert.ok(button,`${id} mission ${index+1} should render its correct option`);
      const before=Number(elements.get('#scoreTotal').textContent);
      button.onclick();
      assert.match(elements.get('.feedback').textContent,/Doğru seçim!/);
      assert.equal(Number(elements.get('#scoreTotal').textContent),before+1);
      button.onclick();
      assert.equal(Number(elements.get('#scoreTotal').textContent),before+1,`${id} should not reward one answer twice`);
      elements.get('#missionNext').onclick();
    });
    assert.match(body.innerHTML,/Görev dizisi tamamlandı!/);
  }
});

test('all knowledge prompts have valid choices and explanations', () => {
  for (const question of [...data.quiz, ...data.race, ...data.detective, ...data.searchChallenges]) {
    assert.ok(question.q.trim(), 'question text should not be empty');
    assert.equal(question.a.length, 3, `${question.q}: expected three choices`);
    assert.ok(question.ok >= 0 && question.ok < question.a.length, `${question.q}: answer index out of range`);
    assert.ok(question.why.trim(), `${question.q}: explanation should be present`);
  }
});

test('wheel categories are represented by questions', () => {
  for (const category of data.categories) assert.ok(data.quiz.some(q => q.cat === category), `missing ${category}`);
});

test('binary targets can be represented by the four place cards', () => {
  for (const card of data.binaryTargets) {
    assert.ok(card.target > 0 && card.target < 16);
    assert.ok(card.hint.includes(String(card.target)) || card.hint.split(' + ').reduce((sum, bit) => sum + Number(bit), 0) === card.target);
  }
});

test('memory game contains distinct concept/function pairs', () => {
  assert.ok(data.memoryPairs.length >= 6);
  assert.equal(new Set(data.memoryPairs.map(([concept]) => concept)).size, data.memoryPairs.length);
  for (const pair of data.memoryPairs) assert.ok(pair.every(value => value.trim()));
});

test('file detective only uses the four supported file categories', () => {
  const types = new Set(['Görsel', 'Ses', 'Video', 'Belge']);
  for (const file of data.fileItems) {
    assert.match(file.name, /\.[a-z0-9]+$/i);
    assert.ok(types.has(file.type));
    assert.ok(file.why.trim());
  }
});

test('debug prompts point to a real faulty step and explain it', () => {
  for (const puzzle of data.debugPuzzles) {
    assert.ok(puzzle.wrong >= 0 && puzzle.wrong < puzzle.steps.length);
    assert.ok(puzzle.fix.trim());
  }
});

test('robot route solution uses available commands', () => {
  for (const command of data.sequence.solution) assert.ok(data.sequence.options.includes(command));
});

test('password safety game has both safe and unsafe teaching examples', () => {
  assert.ok(data.securityRules.some(rule => rule.safe));
  assert.ok(data.securityRules.some(rule => !rule.safe));
  for (const rule of data.securityRules) assert.ok(rule.text.trim() && rule.why.trim());
});

test('storage units are ordered from smaller to larger', () => {
  assert.equal(Array.from(data.storageUnits, item => item.unit).join(','), 'B,KB,MB,GB,TB');
  for (const item of data.storageUnits) assert.ok(item.name.trim() && item.hint.trim());
});

test('loop pattern answers create the exact target sequence', () => {
  assert.ok(data.loopPatterns.length >= 3);
  for (const item of data.loopPatterns) {
    assert.ok(item.pattern.length > 0 && item.repeats > 1);
    assert.ok(item.options.includes(item.repeats));
    assert.equal(item.pattern.length * item.repeats, Array.from({length:item.repeats},()=>item.pattern).flat().length);
  }
});

test('AI simulations teach unseen feature coverage without claiming real AI', () => {
  assert.ok(data.aiMissions.length >= 3);
  for (const item of data.aiMissions) {
    assert.ok(item.known.length && item.probe && item.knownTrait !== item.probeTrait);
    assert.ok(item.label && item.otherLabel && item.why.trim());
  }
  assert.match(appSource, /gerçek bir yapay zekâ değil/);
});

test('packet challenges have a complete unique order and safe original sample text', () => {
  assert.ok(data.packetMissions.length >= 3);
  for (const mission of data.packetMissions) {
    const nums = Array.from(mission.parts, part => part.number).sort((a,b)=>a-b);
    assert.deepEqual(nums, Array.from({length:mission.parts.length},(_,index)=>index+1));
    assert.ok(mission.parts.every(part => part.text.trim()));
    assert.ok(mission.why.trim());
  }
});

test('pixel art grids are valid 5 by 5 binary bitmaps', () => {
  assert.ok(data.pixelPatterns.length >= 3);
  for (const image of data.pixelPatterns) {
    assert.equal(image.rows.length,5);
    for (const row of image.rows) assert.match(row,/^[01]{5}$/);
    assert.ok(image.why.trim());
  }
});

test('condition and permission scenarios have valid answer choices and useful explanations', () => {
  for(const mission of [...data.conditionMissions,...data.permissionMissions]){
    assert.ok(mission.options.length>=3);
    assert.ok(mission.ok>=0&&mission.ok<mission.options.length);
    assert.equal(new Set(mission.options).size,mission.options.length);
    assert.ok(mission.why.trim());
  }
  assert.ok(data.permissionMissions.every(item=>/yetişkin|kontrol|izin/i.test(item.why)));
});

test('alphabet number puzzles decode to their designated Turkish answer', () => {
  const alphabet='ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
  for(const item of data.cipherMissions){
    const decoded=item.code.map(number=>alphabet[number-1]).join('');
    assert.ok(item.code.every(number=>Number.isInteger(number)&&number>0&&number<=alphabet.length));
    assert.equal(item.options[item.ok],decoded);
    assert.ok(item.why.trim());
  }
});

test('run-length compression answers preserve every symbol and its order', () => {
  for(const item of data.compressionMissions){
    const encoded=item.options[item.ok];
    const reconstructed=Array.from(encoded.matchAll(/(\d+)([^\d\s])/gu),match=>Array(Number(match[1])).fill(match[2])).flat();
    assert.deepEqual(Array.from(reconstructed),Array.from(item.sequence));
    assert.ok(item.sequence.length>0&&item.why.trim());
  }
});

test('correct sorting results award once and lock further scoring', () => {
  const sort=appSource.slice(appSource.indexOf('function sort(){'),appSource.indexOf('function race(){'));
  assert.match(sort,/if\(correct\)\{addPoints\(\);\$\('#sortCheck'\)\.disabled=true/);
});

test('race waits for the learner and only moves on a correct answer', () => {
  const race = appSource.slice(appSource.indexOf('function race(){'), appSource.indexOf('function word(){'));
  assert.match(race, /if\(body\.dataset\.raceAnswered\)return/);
  assert.match(race, /if\(correct\)\{[\s\S]*?questionIndex\+\+;[\s\S]*?raceProgress/);
  assert.match(race, /else\{\s*next\.textContent='Bir daha dene →'/);
  assert.match(race, /id="raceContinue" hidden>Devam et →<\/button>/,'the initially hidden next-step button still needs an accessible name');
  assert.doesNotMatch(race, /setTimeout\(/, 'race should not skip a question before the learner is ready');
});

test('mystery box answers normalize Turkish text and support Enter', () => {
  const boxes = appSource.slice(appSource.indexOf('function boxes(){'), appSource.indexOf('function sort(){'));
  assert.match(boxes, /normalize\('NFC'\)/);
  assert.match(boxes, /toLocaleLowerCase\('tr'\)/);
  assert.match(boxes, /event\.key==='Enter'/);
});

test('sorting bins accept keyboard selection', () => {
  const sort = appSource.slice(appSource.indexOf('function sort(){'), appSource.indexOf('function race(){'));
  assert.match(sort, /bin\.onkeydown/);
  assert.match(sort, /event\.key==='Enter'\|\|event\.key===' '/);
});

test('repeatable sequence answers cannot award points twice', () => {
  const sequence = appSource.slice(appSource.indexOf('function sequence(){'), appSource.indexOf('function detective(){'));
  assert.match(sequence, /sequenceRewarded/);
  assert.match(sequence, /if\(ok\)\{[\s\S]*?runSequence'\)\.disabled=true/);
});

test('new games provide touch, keyboard, and deliberate next-step controls', () => {
  assert.match(appSource, /data-repeat/);
  assert.match(appSource, /data-packet/);
  assert.match(appSource, /data-pixel/);
  assert.match(appSource, /memoryContinue/);
  assert.match(appSource, /filesNext/);
});

test('packet selection state survives each redraw and resets only between missions', () => {
  const packets = appSource.slice(appSource.indexOf('function packets(){'), appSource.indexOf('function pixels(){'));
  assert.match(packets, /let round=0,score=0,chosen=\[\],solved=false/);
  assert.match(packets, /chosen\.push\(Number\(button\.dataset\.packet\)\);render\(\)/);
  assert.match(packets, /round\+\+;chosen=\[\];solved=false;render\(\)/);
  assert.doesNotMatch(packets, /const mission=deck\[round\],[^;]+;let chosen=/);
});
