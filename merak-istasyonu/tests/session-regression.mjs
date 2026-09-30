import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function harness(){
  const elements=new Map();
  function element(){return {innerHTML:'',textContent:'',value:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},showModal(){},querySelectorAll(selector){
    if(selector!=='[data-a]')return [];
    if(this.markup!==this.innerHTML){this.markup=this.innerHTML;this.answers=[...this.innerHTML.matchAll(/data-a="(\d+)"/g)].map(m=>({dataset:{a:m[1]},classList:{add(){}},disabled:false}));}
    return this.answers;
  },querySelector(selector){return lookup(selector)}}}
  function lookup(selector){if(!elements.has(selector))elements.set(selector,element());return elements.get(selector)}
  const context={window:{},document:{querySelector:lookup},localStorage:{getItem(){return null},setItem(){}},setTimeout(){return 1},clearTimeout(){},Math};
  vm.runInNewContext(fs.readFileSync(new URL('../js/data.js',import.meta.url),'utf8'),context);
  const app=fs.readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
  vm.runInNewContext(app.replace(/\}\)\(\);\s*$/,'window.testHooks={quizRound,resetGameSession,openGame};})();'),context);
  return{context,lookup,hooks:context.window.testHooks};
}
test('second and third wheel questions accept answers without leaking the previous lock',()=>{
  const {lookup,hooks}=harness();
  const pool=[{q:'Plan?',a:['Algoritma','Klasör'],ok:0,why:'Adım adım plan.'}];
  const body=lookup('#gameBody');body.dataset.answered='1';
  for(let round=1;round<=3;round++){
    hooks.quizRound(pool);
    const correct=body.querySelectorAll('[data-a]').find(b=>b.dataset.a==='0');
    correct.onclick();correct.onclick();
    assert.match(lookup('.feedback').textContent,/Harika/);
    assert.equal(lookup('#scoreTotal').textContent,String(round),'only one reward per question');
    assert.equal(lookup('.next-question').hidden,false);
  }
});
test('new game clears all stale interaction locks, without clearing saved points',()=>{
  const {lookup,hooks}=harness();
  Object.assign(lookup('#gameBody').dataset,{answered:'1',raceAnswered:'1',sequenceRewarded:'1',rewarded:'1'});
  lookup('#scoreTotal').textContent='12';
  hooks.openGame('wheel');
  assert.equal(Object.keys(lookup('#gameBody').dataset).length,0);
  assert.equal(lookup('#scoreTotal').textContent,'12');
});
