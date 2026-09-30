(()=>{'use strict';
const D=window.GAME_DATA, $=s=>document.querySelector(s), dialog=$('#gameDialog'), body=$('#gameBody');let selectedSort=null,points=0,muted=true,activeTimer=null;try{points=Math.max(0,Number(localStorage.getItem('merak-points'))||0)}catch{}$('#scoreTotal').textContent=String(points);
function shuffled(items){const result=items.slice();for(let index=result.length-1;index>0;index--){const other=Math.floor(Math.random()*(index+1));[result[index],result[other]]=[result[other],result[index]]}return result}
const games=[
 {id:'wheel',icon:'◉',title:'Bilgi Çarkı',desc:'Çarkı çevir, bilişim başlığını seç ve kısa bir bilgi sorusunu çöz.',topic:'KARMA BİLGİ',color:'--aqua',time:'3 dk',run:wheel},
 {id:'box',icon:'▣',title:'Gizemli Kutu',desc:'Kutuyu aç, ipucunu oku ve saklı kavramı bul.',topic:'KAVRAMLAR',color:'--violet',time:'3 dk',run:boxes},
 {id:'sort',icon:'⠿',title:'Dijital Düzen',desc:'Araçları giriş ve çıkış istasyonlarına yerleştir.',topic:'DONANIM',color:'--orange',time:'4 dk',run:sort},
 {id:'race',icon:'➤',title:'Kod Garajı',desc:'Doğru yanıtlarla mini arabanı bitiş çizgisine sür.',topic:'YARIŞ',color:'--pink',time:'4 dk',run:race},
 {id:'word',icon:'⌁',title:'Kelime Robotu',desc:'İpuçlarını kullan, robotun enerji hücrelerini koru.',topic:'KELİME',color:'--lime',time:'3 dk',run:word},
 {id:'sequence',icon:'⌘',title:'Robot Rotası',desc:'Komutları sıralayıp robotu yıldızına ulaştır.',topic:'ALGORİTMA',color:'--blue',time:'4 dk',run:sequence},
 {id:'detective',icon:'⌕',title:'Siber Dedektif',desc:'Dijital dünyadaki ipuçlarını incele, güvenli seçimi bul.',topic:'GÜVENLİK',color:'--aqua',time:'4 dk',run:detective},
 {id:'binary',icon:'▦',title:'İkili Sayı Büyüsü',desc:'8–4–2–1 kartlarını kullan, hedef sayıyı oluştur.',topic:'SAYI SİSTEMLERİ',color:'--violet',time:'3 dk',run:binary},
 {id:'memory',icon:'▤',title:'Kavram Hafızası',desc:'Bilişim araçlarını görevleriyle eşleştir; hamlelerini düşün.',topic:'EŞLEŞTİRME',color:'--orange',time:'4 dk',run:memory},
 {id:'files',icon:'▧',title:'Dosya Dedektifi',desc:'Dosya adlarının sonundaki ipucundan türünü keşfet.',topic:'DOSYALAR',color:'--blue',time:'3 dk',run:files},
 {id:'debug',icon:'⌁',title:'Hata Avcısı',desc:'Adım adım ilerle; algoritmadaki işe yaramayan adımı bul.',topic:'ALGORİTMA',color:'--pink',time:'3 dk',run:debug},
 {id:'search',icon:'⌕',title:'Arama Sihirbazı',desc:'Kaynakları, tarihleri ve kanıtları karşılaştırarak doğru bilgiye ulaş.',topic:'DİJİTAL OKURYAZARLIK',color:'--aqua',time:'4 dk',run:search},
 {id:'shield',icon:'⬡',title:'Siber Kalkan',desc:'Parola güvenliğinin güçlü alışkanlıklarını seç; hiçbir parola yazma.',topic:'GİZLİLİK',color:'--lime',time:'3 dk',run:shield},
 {id:'storage',icon:'▥',title:'Veri Merdiveni',desc:'Bayttan terabayta veri birimlerini küçükten büyüğe sırala.',topic:'DOSYA BOYUTU',color:'--orange',time:'3 dk',run:storage},
 {id:'loops',icon:'⌘',title:'Döngü Dokumacısı',desc:'Tekrar bloklarıyla şekil ve komut desenleri kur.',topic:'ALGORİTMA',color:'--aqua',time:'4 dk',run:loops},
 {id:'ai-lab',icon:'✺',title:'Robotun Yanılgısı',desc:'Örnek çeşitliliğinin bir öğrenen modeli nasıl etkilediğini keşfet.',topic:'YAPAY ZEKÂ',color:'--violet',time:'4 dk',run:aiLab},
 {id:'packets',icon:'▤',title:'Paket Postanesi',desc:'Numaralı veri paketlerini seçip mesajı yeniden birleştir.',topic:'AĞ İLETİŞİMİ',color:'--blue',time:'4 dk',run:packets},
 {id:'pixels',icon:'▦',title:'Piksel Atölyesi',desc:'Piksel tablosunu açıp küçük bir bitmap şekli oluştur.',topic:'SAYISAL GÖRÜNTÜ',color:'--pink',time:'4 dk',run:pixels},
 {id:'conditions',icon:'⇢',title:'Koşul Köprüsü',desc:'“Eğer… ise” kurallarıyla robotu doğru yola yönlendir.',topic:'KOŞULLAR',color:'--orange',time:'3 dk',run:conditions},
 {id:'cipher',icon:'⌗',title:'Sayı Şifreleri',desc:'Harflerin sıra numaralarını çöz, kısa bilişim mesajlarını oku.',topic:'VERİ TEMSİLİ',color:'--violet',time:'3 dk',run:cipher},
 {id:'permissions',icon:'⌑',title:'İzin Bekçisi',desc:'Uygulamanın istediği iznin yaptığı işle ilgili olup olmadığını düşün.',topic:'GİZLİLİK',color:'--lime',time:'3 dk',run:permissions},
 {id:'compression',icon:'▤',title:'Veri Sıkıştırma',desc:'Tekrarlanan sembolleri kısa kodla göster ve doğru diziyi bul.',topic:'VERİ',color:'--blue',time:'3 dk',run:compression},
 {id:'web-page',icon:'▣',title:'Web Sayfası Mimarı',desc:'Bir web sayfasının bölümlerini okuma sırasına göre düzenle.',topic:'WEB TASARIMI',color:'--aqua',time:'4 dk',run:webPage},
 {id:'rgb',icon:'◈',title:'Renk Laboratuvarı',desc:'Kırmızı, yeşil ve mavi ışığı karıştırıp hedef rengi yakala.',topic:'SAYISAL GÖRÜNTÜ',color:'--pink',time:'3 dk',run:rgbLab},
 {id:'license',icon:'©',title:'Görsel Lisansı Dedektifi',desc:'CC lisanslarının temel işaretlerini öğren; bir görseli kullanmadan önce kaynağını doğrula.',topic:'TELİF & LİSANS',color:'--orange',time:'4 dk',run:licenseGame},
 {id:'accessibility',icon:'◎',title:'Erişilebilirlik Kahramanı',desc:'Web sayfalarını farklı ihtiyaçları olan herkes için daha anlaşılır tasarla.',topic:'ERİŞİLEBİLİRLİK',color:'--aqua',time:'4 dk',run:accessibilityGame},
 {id:'cloud',icon:'☁',title:'Bulut Kuryesi',desc:'Dosya paylaşımı, eşitleme ve yedekleme kararlarını ver.',topic:'AĞ & BULUT',color:'--blue',time:'4 dk',run:cloudGame},
 {id:'ai-check',icon:'✳',title:'Yapay Zekâ Gerçeklik Kontrolü',desc:'Yapay zekâ cevaplarını ve üretilen içerikleri dikkatle değerlendir.',topic:'YAPAY ZEKÂ',color:'--violet',time:'4 dk',run:aiCheckGame},
 {id:'gates',icon:'⌁',title:'Mantık Kapıları Laboratuvarı',desc:'Açma-kapama anahtarlarıyla VE, VEYA, DEĞİL ve XOR devrelerini çalıştır.',topic:'MANTIK & DEVRELER',color:'--lime',time:'4 dk',run:logicGates},
 {id:'network-route',icon:'⌖',title:'Ağ Rotası Kurucusu',desc:'Verinin hedefine ulaşması için ağdaki doğru aracı bul.',topic:'AĞ & BULUT',color:'--blue',time:'4 dk',run:networkRoutes}
];
games.push(...D.microGames.map(pack=>({id:pack.id,icon:pack.icon,title:pack.title,desc:pack.desc,topic:pack.topic,color:pack.color,format:pack.kind,time:'4 dk',run:()=>runMicroGame(pack)})));
const puzzleGameIds=new Set(['box','sort','word','sequence','binary','memory','files','storage','loops','packets','pixels','conditions','cipher','compression','web-page','rgb','gates','network-route']);
function gameGroup(g){if(puzzleGameIds.has(g.id)||['order','sort','riddle','match','wordsearch'].includes(g.format))return'puzzles';if(['ALGORİTMA','KOŞULLAR','SAYI SİSTEMLERİ','SAYISAL GÖRÜNTÜ','VERİ TEMSİLİ','VERİ','WEB TASARIMI','ERİŞİLEBİLİRLİK','MANTIK & DEVRELER'].includes(g.topic))return'code';if(['DONANIM','DOSYALAR','AĞ İLETİŞİMİ','AĞ & BULUT'].includes(g.topic))return'devices';if(['GÜVENLİK','GİZLİLİK','TELİF & LİSANS'].includes(g.topic))return'safety';return'logic'}
function cardMarkup(g){return `<article class="game-card" data-group="${gameGroup(g)}" style="--accent:var(${g.color})"><div class="card-top"><span class="game-icon">${g.icon}</span><span class="game-time">◷ ${g.time}</span></div><h3>${g.title}</h3><p>${g.desc}</p><div class="card-bottom"><span class="topic-tag">${g.topic}</span><span class="play-link">Oyna&nbsp; →</span></div><button class="card-hit" aria-label="${g.title} oyununu aç" data-game="${g.id}"></button></article>`}
const grid=$('#gameGrid'),filters=$('#gameFilters'),gameSearch=$('#gameSearch');let selectedGameFilter='all';
grid.innerHTML=games.map(cardMarkup).join('');
function filterGames(){const query=gameSearch.value.trim().toLocaleLowerCase('tr-TR');let visible=0;grid.querySelectorAll('.game-card').forEach(card=>{const matchesGroup=selectedGameFilter==='all'||card.dataset.group===selectedGameFilter,matchesText=!query||card.textContent.toLocaleLowerCase('tr-TR').includes(query);card.hidden=!(matchesGroup&&matchesText);if(!card.hidden)visible++});$('#gameCount').textContent=String(visible);const puzzleTotal=grid.querySelectorAll('.game-card[data-group="puzzles"]').length;const puzzleCount=filters.querySelector('[data-filter-count="puzzles"]');if(puzzleCount)puzzleCount.textContent=String(puzzleTotal);$('#emptyGames').hidden=visible>0;$('#surpriseGame').disabled=visible===0}
filters.addEventListener('click',event=>{const filter=event.target.closest('[data-filter]');if(!filter)return;selectedGameFilter=filter.dataset.filter;filters.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button===filter)));filterGames()});
gameSearch.addEventListener('input',filterGames);filterGames();
$('#surpriseGame').addEventListener('click',()=>{const available=Array.from(grid.querySelectorAll('.game-card')).filter(card=>!card.hidden).map(card=>card.querySelector('[data-game]').dataset.game);if(available.length)openGame(available[Math.floor(Math.random()*available.length)])});
grid.addEventListener('click',e=>{const b=e.target.closest('[data-game]');if(b)openGame(b.dataset.game)});
$('#closeGame').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>{if(activeTimer)clearTimeout(activeTimer);activeTimer=null});$('#resetProgress').onclick=()=>{if(confirm('Bu cihazdaki puan ve ilerleme silinsin mi?')){try{localStorage.removeItem('merak-points')}catch{}points=0;$('#scoreTotal').textContent='0';alert('İlerleme sıfırlandı. Yeni keşiflere hazırsın!')}};
$('#soundToggle').onclick=e=>{muted=!muted;e.currentTarget.setAttribute('aria-pressed',String(!muted));e.currentTarget.querySelector('span').textContent=muted?'Ses kapalı':'Ses açık'};
function binary(){let round=0;const deck=D.binaryTargets.slice().sort(()=>Math.random()-.5).slice(0,3);function show(){const card=deck[round],bits=[8,4,2,1],chosen=new Set();body.innerHTML=`${intro(`TUR ${round+1}/3 · Her kart bir basamağı gösterir. Seçtiklerinin toplamı hedefe ulaşmalı.`)}<div class="binary-target">HEDEF <b>${card.target}</b></div><div class="bit-row">${bits.map((n,i)=>`<button class="bit-card" data-bit="${n}" aria-pressed="false"><small>${4-i}. BASAMAK</small><b>${n}</b><span>0 · kapalı</span></button>`).join('')}</div><div class="bit-equation" aria-live="polite">Toplam: 0</div><div class="feedback" aria-live="polite"></div><button class="action-button" id="binaryCheck">Toplamı kontrol et</button><button class="action-button" id="binaryNext" hidden>Sonraki hedef →</button>`;body.querySelectorAll('[data-bit]').forEach(b=>b.onclick=()=>{const value=Number(b.dataset.bit);if(chosen.has(value)){chosen.delete(value);b.setAttribute('aria-pressed','false');b.querySelector('span').textContent='0 · kapalı'}else{chosen.add(value);b.setAttribute('aria-pressed','true');b.querySelector('span').textContent='1 · açık'}$('.bit-equation').textContent=`${[...chosen].join(' + ')||'0'} = ${[...chosen].reduce((a,n)=>a+n,0)}`});$('#binaryCheck').onclick=()=>{const sum=[...chosen].reduce((a,n)=>a+n,0),ok=sum===card.target;$('.feedback').textContent=ok?`Doğru! ${card.hint} = ${card.target}. Bir bitin açık olması, o basamağın toplama katılması demektir.`:`Şu an toplam ${sum}. Hedef ${card.target}; kartların değerlerini toplayıp yeniden dene.`;if(ok){addPoints();$('#binaryCheck').hidden=true;$('#binaryNext').hidden=false}};$('#binaryNext').onclick=()=>{round++;round<deck.length?show():(body.innerHTML=`<div class="success-box"><span>🔢</span><h3>İkili sayı ustası!</h3><p>Bitler 0 veya 1 olur; basamak değerleri birlikte sayıyı oluşturur.</p><button class="action-button" id="binaryAgain">Yeniden oyna</button></div>`,$('#binaryAgain').onclick=binary)}}show()}
function memory(){
  const deck=D.memoryPairs.flatMap((pair,pairId)=>pair.map(label=>({pairId,label}))).sort(()=>Math.random()-.5);
  let first=null,locked=false,matches=0,moves=0,pending=null;
  const open=new Set(),matched=new Set();
  function matchesCard(index){return matched.has(index)}
  function render(){
    body.innerHTML=`${intro('İki kart aç. Kavram ile görevini eşleştir. Acele etmene gerek yok.')}<p class="muted">Eşleşme: ${matches}/${D.memoryPairs.length} · Hamle: ${moves}</p><div class="memory-grid">${deck.map((card,index)=>{const visible=matchesCard(index)||open.has(index);return `<button class="memory-card" data-memory="${index}" aria-label="${visible?card.label:'Kapalı kart'}" ${visible||locked?'disabled':''}>${visible?card.label:'?'}</button>`}).join('')}</div><p class="feedback" aria-live="polite">${locked?'Kartlar eşleşmedi. İpucunu aklında tut; hazır olduğunda kapatıp devam et.':'İpucu: Bir kartı açık tutup eşini ara.'}</p>${locked?'<button class="action-button" id="memoryContinue">Kartları kapatıp devam et →</button>':''}`;
    body.querySelectorAll('[data-memory]').forEach(button=>button.onclick=()=>flip(Number(button.dataset.memory)));
    if(locked)$('#memoryContinue').onclick=()=>{pending.forEach(index=>open.delete(index));pending=null;locked=false;render()};
  }
  function flip(index){
    if(locked||matched.has(index)||open.has(index))return;
    open.add(index);
    if(first===null){first=index;render();return}
    moves++;const prior=first;first=null;
    if(deck[prior].pairId===deck[index].pairId){matched.add(prior);matched.add(index);matches++;render();if(matches===D.memoryPairs.length){$('.feedback').textContent=`Bütün kavramlar eşleşti! ${moves} hamlede tamamladın. Her araç farklı bir görev üstlenir.`;addPoints(2)}return}
    locked=true;pending=[prior,index];render();
  }
  render();
}
function files(){
  const rounds=D.fileItems.slice().sort(()=>Math.random()-.5).slice(0,5),types=['Görsel','Ses','Video','Belge'];let i=0,score=0;
  function show(){
    if(i>=rounds.length){body.innerHTML=`<div class="success-box"><span>📁</span><h3>Dosya rafları düzenlendi!</h3><p>${score}/${rounds.length} doğru. Uzantı ipucu verir; dosyayı açmadan içeriğin güvenli olduğunu tek başına kanıtlamaz.</p><button class="action-button" id="filesAgain">Yeni dosyalar →</button></div>`;$('#filesAgain').onclick=files;if(score)addPoints(score);return}
    const item=rounds[i];let answered=false;
    body.innerHTML=`${intro(`DOSYA ${i+1}/${rounds.length} · Dosya adının sonundaki uzantıya bak.`)}<div class="file-ticket"><span>📄</span><b>${item.name}</b><small>Hangi rafa gitsin?</small></div><div class="file-bins">${types.map(type=>`<button class="file-bin" data-type="${type}"><span>${({Görsel:'▧',Ses:'♫',Video:'▷',Belge:'▤'})[type]}</span>${type}</button>`).join('')}</div>${feedback()}<button class="action-button" id="filesNext" hidden>Sonraki dosya →</button>`;
    body.querySelectorAll('[data-type]').forEach(button=>button.onclick=()=>{if(answered)return;answered=true;const correct=button.dataset.type===item.type;if(correct)score++;body.querySelectorAll('[data-type]').forEach(option=>option.disabled=true);$('.feedback').textContent=(correct?'Raf doğru! ':'İpucu: ')+item.why;$('#filesNext').hidden=false;$('#filesNext').onclick=()=>{i++;show()}});
  }
  show();
}
function debug(){const rounds=D.debugPuzzles.slice().sort(()=>Math.random()-.5).slice(0,3);let i=0,score=0;function show(){if(i===rounds.length){body.innerHTML=`<div class="success-box"><span>🛠️</span><h3>Hata avı tamamlandı!</h3><p>${score}/${rounds.length} adımda sorunu buldun. Programları test etmek, hataları fark edip düzeltmenin önemli bir parçasıdır.</p><button class="action-button" id="debugAgain">Yeni algoritmalar →</button></div>`;$('#debugAgain').onclick=debug;if(score)addPoints(score);return}const puzzle=rounds[i++];body.innerHTML=`${intro(`ALGORİTMA ${i}/${rounds.length} · “${puzzle.goal}” akışında işe yaramayan adımı seç.`)}<div class="debug-steps">${puzzle.steps.map((step,n)=>`<button class="debug-step" data-step="${n}"><span>${n+1}</span>${step}</button>`).join('')}</div>${feedback()}<button class="action-button" id="debugNext" hidden>Sonraki algoritma →</button>`;body.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{const ok=Number(b.dataset.step)===puzzle.wrong;body.querySelectorAll('[data-step]').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('.feedback').textContent=(ok?'Hatayı buldun! ':'Bir ipucu: ')+puzzle.fix;if(ok)score++;$('#debugNext').hidden=false;$('#debugNext').onclick=show})}show()}
function search(){const rounds=D.searchChallenges.slice().sort(()=>Math.random()-.5);let i=0,score=0;function show(){if(i===rounds.length){body.innerHTML=`<div class="success-box"><span>🔎</span><h3>Arama görevi tamamlandı</h3><p>${score}/${rounds.length} kaynak değerlendirmesinde başarılısın. Bir iddiayı paylaşmadan önce kaynağını ve güncelliğini kontrol et.</p><button class="action-button" id="searchAgain">Yeni araştırma →</button></div>`;$('#searchAgain').onclick=search;if(score)addPoints(score);return}const q=rounds[i++],choices=q.a.map((choice,index)=>({choice,index})).sort(()=>Math.random()-.5);body.innerHTML=`${intro(`ARAŞTIRMA ${i}/${rounds.length} · İyi bir kâşif, ilk gördüğünü hemen doğru saymaz.`)}<div class="question">${q.q}</div><div class="answers">${choices.map((x,k)=>`<button class="answer-button" data-search="${k}">${x.choice}</button>`).join('')}</div>${feedback()}<button class="action-button" id="searchNext" hidden>Sonraki araştırma →</button>`;body.querySelectorAll('[data-search]').forEach(b=>b.onclick=()=>{const choice=choices[Number(b.dataset.search)],ok=choice.index===q.ok;body.querySelectorAll('[data-search]').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('.feedback').textContent=(ok?'İyi değerlendirme! ':'Bir ipucu: ')+q.why;if(ok)score++;$('#searchNext').hidden=false;$('#searchNext').onclick=show})}show()}
function shield(){
  const rules=D.securityRules.slice().sort(()=>Math.random()-.5),selected=new Set();
  body.innerHTML=`${intro('Gerçek parolanı asla oyuna yazma. Burada yalnızca güvenli alışkanlıkları seçeceksin.')}<div class="question">Hesaplarını korumak için hangi alışkanlıklar güvenlidir?</div><div class="shield-rules">${rules.map((rule,i)=>`<button class="shield-rule" data-rule="${i}" aria-pressed="false"><span>＋</span>${rule.text}</button>`).join('')}</div>${feedback()}<button class="action-button" id="shieldCheck">Kalkanımı kontrol et</button><button class="action-button" id="shieldAgain" hidden>Yeniden dene →</button>`;
  body.querySelectorAll('[data-rule]').forEach(button=>button.onclick=()=>{
    const i=Number(button.dataset.rule),active=!selected.has(i);
    active?selected.add(i):selected.delete(i);
    button.setAttribute('aria-pressed',String(active));
    button.querySelector('span').textContent=active?'✓':'＋';
  });
  $('#shieldCheck').onclick=()=>{
    const right=new Set(rules.map((rule,i)=>rule.safe?i:-1).filter(i=>i>=0));
    const correct=right.size===selected.size&&[...right].every(i=>selected.has(i));
    $('.feedback').textContent=correct?'Kalkan tamam! Uzun ve farklı parolalar kullan; kişisel bilgileri parola yapma, gizli tut.':'Güzel deneme. Seçtiklerini gözden geçir; ipuçlarını oku ve tekrar kontrol et.';
    body.querySelectorAll('[data-rule]').forEach(button=>{
      const rule=rules[Number(button.dataset.rule)];
      button.classList.toggle('safe-hint',rule.safe);button.classList.toggle('unsafe-hint',!rule.safe);
      button.querySelector('span').textContent=rule.safe?'✓':'×';
    });
    if(correct){
      if(body.dataset.rewarded!=='1'){body.dataset.rewarded='1';addPoints()}
      $('#shieldAgain').hidden=false;
      body.querySelectorAll('[data-rule]').forEach(button=>button.disabled=true);
    }
  };
  $('#shieldAgain').onclick=shield;
}
function storage(){
  const order=D.storageUnits.map(item=>item.unit),pool=D.storageUnits.slice().sort(()=>Math.random()-.5),chosen=[];
  function render(){
    body.innerHTML=`${intro('Büyük birimler daha çok veri saklar. Kartlara dokunup küçükten büyüğe sırala.')}<div class="storage-stair"><b>SEÇTİĞİN SIRA</b><div class="storage-picked">${chosen.map((unit,index)=>`<button class="storage-chip" data-remove-unit="${index}" aria-label="${unit} birimini sıradan çıkar">${index+1}. ${unit} ×</button>`).join('')||'<span class="muted">Henüz birim seçmedin</span>'}</div></div><div class="storage-options">${pool.filter(item=>!chosen.includes(item.unit)).map(item=>`<button class="storage-option" data-unit="${item.unit}"><b>${item.unit}</b><span>${item.name}</span></button>`).join('')}</div><p class="feedback" aria-live="polite"></p><button class="action-button" id="storageCheck">Sırayı kontrol et</button>`;
    body.querySelectorAll('[data-unit]').forEach(button=>button.onclick=()=>{chosen.push(button.dataset.unit);render()});
    body.querySelectorAll('[data-remove-unit]').forEach(button=>button.onclick=()=>{chosen.splice(Number(button.dataset.removeUnit),1);render()});
    $('#storageCheck').onclick=()=>{
      if(chosen.length!==order.length){$('.feedback').textContent=`${order.length-chosen.length} birim daha seçmelisin.`;return}
      const correct=order.every((unit,index)=>chosen[index]===unit);
      $('.feedback').textContent=correct?'Harika sıralama! Bayt < Kilobayt < Megabayt < Gigabayt < Terabayt. Bir üst basamak daha büyük veri kapasitesini anlatır.':'Bir ipucu: Sıra B, KB, MB, GB, TB şeklinde küçükten büyüğe ilerler. Kartları yeniden düzenleyebilirsin.';
      if(correct){addPoints();$('#storageCheck').textContent='Tamamlandı ✓';$('#storageCheck').disabled=true}
    };
  }
  render();
}
function loops(){
  const deck=D.loopPatterns.slice().sort(()=>Math.random()-.5).slice(0,3);let round=0,score=0,chosen=null,rewarded=false;
  function render(){
    if(round>=deck.length){body.innerHTML=`<div class="success-box"><span>🔁</span><h3>Desen ustası!</h3><p>${score}/${deck.length} görevi tamamladın. Döngüler, tekrarlanan komutları kısa ve anlaşılır biçimde yazmamızı sağlar.</p><button class="action-button" id="loopsAgain">Yeniden dokumaya başla</button></div>`;$('#loopsAgain').onclick=loops;return}
    const item=deck[round],target=Array.from({length:item.repeats},()=>item.pattern).flat();chosen=null;rewarded=false;
    body.innerHTML=`${intro(`DÖNGÜ ${round+1}/${deck.length} · ${item.name}: tekrarı bul, sonucu karşılaştır.`)}<div class="loop-instructions"><b>Tekrar bloğu</b><div class="loop-pattern">${item.pattern.map(shape=>`<span class="pattern-token">${shape}</span>`).join('')}</div><p>Bu bloğu kaç kez çalıştırırsak hedefteki şekil dizisi oluşur?</p></div><div class="loop-output"><b>Hedef dizi</b><div class="loop-pattern" aria-label="Hedef şekil dizisi">${target.map(shape=>`<span class="pattern-token">${shape}</span>`).join('')}</div><b>Senin programın</b><div id="loopPreview" class="loop-pattern" aria-live="polite"><span class="muted">Önce tekrar sayısını seç</span></div></div><div class="loop-choices" aria-label="Tekrar sayısı seçenekleri">${item.options.slice().sort(()=>Math.random()-.5).map(count=>`<button class="loop-count" data-repeat="${count}" aria-pressed="false">${count} kez</button>`).join('')}</div><p class="feedback" aria-live="polite"></p><button class="action-button" id="loopCheck">Deseni denetle</button><button class="action-button" id="loopNext" hidden>Sonraki desen →</button>`;
    body.querySelectorAll('[data-repeat]').forEach(button=>button.onclick=()=>{chosen=Number(button.dataset.repeat);body.querySelectorAll('[data-repeat]').forEach(option=>option.setAttribute('aria-pressed',String(option===button)));$('#loopPreview').innerHTML=Array.from({length:chosen},()=>item.pattern).flat().map(shape=>`<span class="pattern-token">${shape}</span>`).join('')});
    $('#loopCheck').onclick=()=>{if(chosen===null){$('.feedback').textContent='Önce kaç tekrar gerektiğini seç.';return}if(chosen===item.repeats){$('.feedback').textContent=`Tam isabet! ${item.why}`;if(!rewarded){rewarded=true;score++;addPoints()}$('#loopCheck').disabled=true;body.querySelectorAll('[data-repeat]').forEach(option=>option.disabled=true);$('#loopNext').hidden=false}else{$('.feedback').textContent=`Bu seçim ${chosen*item.pattern.length} şekil üretir; hedefte ${target.length} şekil var. Başka sayıyı dene.`}};
    $('#loopNext').onclick=()=>{round++;render()};
  }
  render();
}
function aiLab(){
  const deck=D.aiMissions.slice().sort(()=>Math.random()-.5);let round=0,stage=0,score=0;
  function render(){
    if(round>=deck.length){body.innerHTML=`<div class="success-box"><span>✺</span><h3>Modeli daha dikkatli eğittin!</h3><p>${score}/${deck.length} görevde örnek çeşitliliğini artırdın. Gerçek yapay zekâ sistemleri çok daha karmaşıktır ve sonuçları yine de kontrol edilmelidir.</p><button class="action-button" id="aiAgain">Yeni örnekleri dene</button></div>`;$('#aiAgain').onclick=aiLab;return}
    const m=deck[round],examples=stage>=2?[...m.known,m.probe]:m.known;
    const result=stage===1?`<div class="ai-result" role="status"><b>İlk tahmin: ${m.otherLabel}</b><p>Robot bu özelliğe benzeyen bir eğitim örneği görmemişti. Bu, basit oyunumuzun kasıtlı yanılgısıdır.</p></div>`:stage===3?`<div class="ai-result ai-correct" role="status"><b>Yeni tahmin: ${m.label}</b><p>${m.why}</p></div>`:'';
    const action=stage===0?'<button class="action-button" id="aiAction">Robotun ilk tahminini gör</button>':stage===1?'<button class="action-button" id="aiAction">Farklı bir örneği doğru etiketle ekle</button>':stage===2?'<button class="action-button" id="aiAction">Örnek çeşitlenince yeniden dene</button>':'<button class="action-button" id="aiAction">Sonraki sınama →</button>';
    body.innerHTML=`${intro(`ÖĞRENEN MODEL ${round+1}/${deck.length} · Bu etkinlik gerçek bir yapay zekâ değil, özellik eşleştiren basit bir simülasyondur.`)}<div class="ai-model"><b>Eğitim örnekleri</b><div class="ai-examples">${examples.map((example,index)=>`<span class="ai-example">${index===m.known.length&&stage>=2?'✚ ':''}${example}<small>etiket: ${m.label}</small></span>`).join('')}</div><div class="ai-probe"><small>YENİ SINAMA ÖRNEĞİ</small><strong>${m.probe}</strong><span>Özellik: ${m.probeTrait}</span></div></div>${result}<p class="feedback" aria-live="polite">${stage===0?`İlk örneklerde robot yalnızca ${m.knownTrait} gördü. Yeni örnek nasıl sonuç verir?`:''}</p>${action}`;
    $('#aiAction').onclick=()=>{if(stage===0)stage=1;else if(stage===1)stage=2;else if(stage===2)stage=3;else{score++;addPoints();round++;stage=0}render()};
  }
  render();
}
function packets(){
  const deck=D.packetMissions.slice().sort(()=>Math.random()-.5);let round=0,score=0,chosen=[],solved=false;
  function render(){
    if(round>=deck.length){body.innerHTML=`<div class="success-box"><span>📬</span><h3>Posta ulaştı!</h3><p>${score}/${deck.length} mesajı doğru sıraya koydun. Bu, veri paketlerinin yeniden birleştirilmesinin basitleştirilmiş bir modelidir.</p><button class="action-button" id="packetsAgain">Yeni posta görevleri</button></div>`;$('#packetsAgain').onclick=packets;return}
    const mission=deck[round],ordered=mission.parts.slice().sort((a,b)=>a.number-b.number);
    body.innerHTML=`${intro(`POSTA ${round+1}/${deck.length} · ${mission.title}. Parçaları numara sırasına göre yerleştir.`)}<div class="packet-board"><b>Karışık paketler</b><div class="packet-options">${mission.parts.filter(part=>!chosen.includes(part.number)).slice().sort(()=>Math.random()-.5).map(part=>`<button class="packet-card" data-packet="${part.number}"><small>PAKET ${part.number}</small><span>${part.text}</span></button>`).join('')}</div><b>Birleştirdiğin mesaj</b><div class="packet-sequence" aria-live="polite">${chosen.map((number,index)=>{const part=mission.parts.find(candidate=>candidate.number===number);return `<button class="packet-chip" data-remove-packet="${index}" aria-label="${number} numaralı ${part.text} paketini çıkar">${number}. ${part.text}</button>`}).join('')||'<span class="muted">Paketleri buraya ekle</span>'}</div></div><p class="feedback" aria-live="polite"></p><button class="action-button" id="packetCheck">Mesajı kontrol et</button><button class="action-button" id="packetNext" hidden>Sonraki posta →</button>`;
    body.querySelectorAll('[data-packet]').forEach(button=>button.onclick=()=>{if(!solved){chosen.push(Number(button.dataset.packet));render()}});
    body.querySelectorAll('[data-remove-packet]').forEach(button=>button.onclick=()=>{if(!solved){chosen.splice(Number(button.dataset.removePacket),1);render()}});
    $('#packetCheck').onclick=()=>{if(solved)return;if(chosen.length!==ordered.length){$('.feedback').textContent=`Mesajda ${ordered.length} paket var; ${ordered.length-chosen.length} tane daha ekle.`;return}const correct=ordered.every((part,index)=>chosen[index]===part.number);if(correct){solved=true;score++;addPoints();$('.feedback').textContent=`Mesaj tamamlandı! ${mission.why}`;$('#packetCheck').disabled=true;body.querySelectorAll('[data-packet],[data-remove-packet]').forEach(button=>button.disabled=true);$('#packetNext').hidden=false}else{$('.feedback').textContent='Paket numaralarını karşılaştır. Sırasını değiştirmek için birleştirdiğin parçaya dokun.'}};
    $('#packetNext').onclick=()=>{round++;chosen=[];solved=false;render()};
  }
  render();
}
function pixels(){
  const deck=D.pixelPatterns.slice().sort(()=>Math.random()-.5).slice(0,3);let round=0,score=0,chosen=[];
  function render(){
    if(round>=deck.length){body.innerHTML=`<div class="success-box"><span>▦</span><h3>Piksel sanatçısı!</h3><p>${score}/${deck.length} bitmap şekli oluşturdun. Piksel ızgaraları, bilgisayarların görsel bilgiyi nasıl küçük parçalara ayırdığını anlamaya yardım eder.</p><button class="action-button" id="pixelsAgain">Yeni çizimlere başla</button></div>`;$('#pixelsAgain').onclick=pixels;return}
    const item=deck[round],target=item.rows.join('').split('').map(Number);chosen=Array(25).fill(0);
    body.innerHTML=`${intro(`PİKSEL ${round+1}/${deck.length} · ${item.name} resmini örnek ızgaraya bakarak oluştur.`)}<div class="pixel-legends"><span><i class="pixel-swatch pixel-on"></i> Açık</span><span><i class="pixel-swatch"></i> Kapalı</span></div><div class="pixel-pair"><div><b>Örnek</b><div class="pixel-grid pixel-target" role="img" aria-label="${item.name} örnek bitmap şekli">${target.map(value=>`<span class="pixel-cell${value?' pixel-on':''}" aria-hidden="true"></span>`).join('')}</div></div><div><b>Senin ızgaran</b><div class="pixel-grid" id="pixelGrid" aria-label="Çizim ızgarası">${chosen.map((value,index)=>`<button class="pixel-cell" data-pixel="${index}" aria-label="${Math.floor(index/5)+1}. satır, ${index%5+1}. sütun" aria-pressed="false">0</button>`).join('')}</div></div></div><p class="muted">Bir kareye dokunarak 0 (kapalı) ve 1 (açık) arasında geçiş yap.</p><p class="feedback" aria-live="polite"></p><button class="action-button" id="pixelCheck">Resmimi kontrol et</button><button class="action-button" id="pixelNext" hidden>Sonraki resim →</button>`;
    body.querySelectorAll('[data-pixel]').forEach(button=>button.onclick=()=>{const index=Number(button.dataset.pixel);chosen[index]=chosen[index]?0:1;button.textContent=String(chosen[index]);button.setAttribute('aria-pressed',String(Boolean(chosen[index])));button.classList.toggle('pixel-on',Boolean(chosen[index]))});
    $('#pixelCheck').onclick=()=>{const errors=target.reduce((total,value,index)=>total+(value!==chosen[index]?1:0),0);if(errors===0){$('.feedback').textContent=`Görüntü tamam! ${item.why}`;score++;addPoints();body.querySelectorAll('[data-pixel]').forEach(button=>button.disabled=true);$('#pixelCheck').disabled=true;$('#pixelNext').hidden=false}else{$('.feedback').textContent=`${errors} kare örnekten farklı. Izgaraları karşılaştırıp yeniden dene.`}};
    $('#pixelNext').onclick=()=>{round++;render()};
  }
  render();
}
function conditions(){
  choiceMissionGame({deck:D.conditionMissions,topic:'KOŞUL',question:item=>item.question,display:item=>`<div class="mission-scene">${item.scene}</div>`,why:item=>item.why,finish:'Koşullu düşünme, programın duruma göre karar vermesini sağlar.'});
}
function cipher(){
  choiceMissionGame({deck:D.cipherMissions,topic:'SAYI KODU',question:()=> 'Hangi kelime bu sayı dizisine karşılık geliyor?',display:item=>`<div class="cipher-code" aria-label="Kodlanmış harf numaraları">${item.code.map((number,index)=>`<span>${number}<small>${index+1}. harf</small></span>`).join('')}</div><p class="muted">Türk alfabesinde A=1, B=2, C=3 … Z=29. (Ç, Ğ, İ, Ö, Ş, Ü de alfabededir.)</p>`,why:item=>item.why,finish:'Sayılar harfleri gösterebilir. Bu etkinlik basit kodlamadır; güvenli şifreleme değildir.'});
}
function permissions(){
  choiceMissionGame({deck:D.permissionMissions,topic:'UYGULAMA İZNİ',question:item=>item.question,display:item=>`<div class="mission-scene">${item.app}</div>`,why:item=>item.why,finish:'Bir iznin gerçekten gerekli olup olmadığını sormak, kişisel bilgileri korumaya yardım eder.'});
}
function compression(){
  choiceMissionGame({deck:D.compressionMissions,topic:'TEKRAR KODU',question:()=> 'Hangi kısa gösterim, şekilleri aynı sırada eksiksiz geri oluşturur?',display:item=>`<div class="compression-sequence" aria-label="Sıkıştırılacak şekil dizisi">${item.sequence.map(shape=>`<span>${shape}</span>`).join('')}</div><p class="muted">Örnek: 3●, “üç daire” demektir. Sembolün sırası ve adedi önemlidir.</p>`,why:item=>item.why,finish:'Tekrarlı veriyi kısa anlatmak yer kazandırabilir. Bu küçük örnek, gerçek sıkıştırma yöntemlerinin tamamını göstermez.'});
}
function webPage(){
  const deck=shuffled(D.pagePlans).slice(0,3);let round=0,score=0,order=deck[0]?shuffled(deck[0].blocks):[],selected=0;
  function render(){
    if(round>=deck.length){body.innerHTML=`<div class="success-box"><span>▣</span><h3>Sayfalar düzenli!</h3><p>${score}/${deck.length} taslağı okuma sırasına koydun. Anlamlı başlıklar ve sıralı içerik, ziyaretçilerin sayfayı anlamasına yardım eder.</p><button class="action-button" id="pageAgain">Yeni sayfa taslakları →</button></div>`;$('#pageAgain').onclick=webPage;return}
    const item=deck[round];
    body.innerHTML=`${intro(`WEB TASLAĞI ${round+1}/${deck.length} · ${item.title}: bölümleri ziyaretçinin okuyacağı sıraya koy.`)}<div class="page-browser"><div class="page-browser-bar"><i></i><i></i><i></i><span>Örnek sayfa taslağı</span></div><p>İçerik bölümlerini seç, yukarı/aşağı taşı ve sırayı kontrol et.</p><div class="page-stack" role="list" aria-label="Web sayfası bölümlerinin sırası">${order.map((block,index)=>`<button class="page-block${index===selected?' selected':''}" data-page-index="${index}" aria-pressed="${index===selected}" aria-label="${index+1}. sıra: ${block}"><b>${index+1}</b><span>${block}</span></button>`).join('')}</div></div><div class="page-controls"><button class="choice-button" id="pageUp" aria-label="Seçili bölümü yukarı taşı">↑ Yukarı</button><button class="choice-button" id="pageDown" aria-label="Seçili bölümü aşağı taşı">↓ Aşağı</button></div><p class="feedback" aria-live="polite"></p><button class="action-button" id="pageCheck">Okuma sırasını kontrol et</button><button class="action-button" id="pageNext" hidden>Sonraki taslak →</button>`;
    body.querySelectorAll('[data-page-index]').forEach(button=>button.onclick=()=>{selected=Number(button.dataset.pageIndex);body.querySelectorAll('[data-page-index]').forEach((row,index)=>{row.classList.toggle('selected',index===selected);row.setAttribute('aria-pressed',String(index===selected))});$('#pageUp').disabled=selected===0;$('#pageDown').disabled=selected===order.length-1});
    $('#pageUp').disabled=selected===0;$('#pageDown').disabled=selected===order.length-1;
    function move(offset){const destination=selected+offset;if(destination<0||destination>=order.length)return;[order[selected],order[destination]]=[order[destination],order[selected]];selected=destination;render();const focused=body.querySelector(`[data-page-index="${selected}"]`);if(focused?.focus)focused.focus()}
    $('#pageUp').onclick=()=>move(-1);$('#pageDown').onclick=()=>move(1);
    $('#pageCheck').onclick=()=>{const correct=order.every((block,index)=>block===item.blocks[index]);$('.feedback').textContent=correct?`Sıra doğru! ${item.why}`:`Henüz tam değil. ${item.why}`;if(correct){score++;addPoints();$('#pageCheck').disabled=true;body.querySelectorAll('[data-page-index],#pageUp,#pageDown').forEach(button=>button.disabled=true);$('#pageNext').hidden=false}};
    $('#pageNext').onclick=()=>{round++;order=deck[round]?shuffled(deck[round].blocks):[];selected=0;render()};
  }
  render();
}
function rgbLab(){
  const deck=shuffled(D.rgbMissions);let round=0,score=0,channels=[0,0,0];
  const names=['Kırmızı ışık (R)','Yeşil ışık (G)','Mavi ışık (B)'];
  function render(){
    if(round>=deck.length){body.innerHTML=`<div class="success-box"><span>◈</span><h3>Renk karışımları tamam!</h3><p>${score}/${deck.length} hedefi oluşturdun. RGB ekran modelinde kırmızı, yeşil ve mavi ışık farklı oranlarda birleşerek renkleri gösterir.</p><button class="action-button" id="rgbAgain">Yeni renk laboratuvarı →</button></div>`;$('#rgbAgain').onclick=rgbLab;return}
    const mission=deck[round];channels=[0,0,0];
    body.innerHTML=`${intro(`RGB LABORATUVARI ${round+1}/${deck.length} · Hedef rengin hangi ışıklardan oluştuğunu bul.`)}<div class="rgb-lab"><div><b>Hedef</b><div class="rgb-swatch" style="background:rgb(${mission.rgb.join(',')})" role="img" aria-label="Hedef renk: ${mission.name}"></div><span>${mission.name}</span></div><div><b>Senin karışımın</b><div class="rgb-swatch" id="rgbPreview" style="background:rgb(0,0,0)" role="img" aria-label="Seçtiğin ışıkların renk karışımı"></div><span id="rgbValues">R 0 · G 0 · B 0</span></div></div><p class="muted">Bu başlangıç oyununda her ışık kapalı (0) veya tam güçte (255). Gerçek ekranlarda ara değerler de kullanılır.</p><div class="rgb-controls">${names.map((name,index)=>`<button class="rgb-channel" data-rgb="${index}" aria-pressed="false"><i></i><span>${name}: Kapalı</span></button>`).join('')}</div><p class="feedback" aria-live="polite"></p><button class="action-button" id="rgbCheck">Rengimi kontrol et</button><button class="action-button" id="rgbNext" hidden>Sonraki renk →</button>`;
    body.querySelectorAll('[data-rgb]').forEach(button=>button.onclick=()=>{const index=Number(button.dataset.rgb);channels[index]=channels[index]?0:255;button.setAttribute('aria-pressed',String(Boolean(channels[index])));button.querySelector('span').textContent=`${names[index]}: ${channels[index]?'Açık':'Kapalı'}`;$('#rgbPreview').style.background=`rgb(${channels.join(',')})`;$('#rgbValues').textContent=`R ${channels[0]} · G ${channels[1]} · B ${channels[2]}`});
    $('#rgbCheck').onclick=()=>{const correct=mission.rgb.every((value,index)=>channels[index]===value);$('.feedback').textContent=correct?`Renk tuttu! ${mission.why}`:'Hedefle karışımını karşılaştır. Her ışığı ayrı ayrı açıp kapatabilirsin.';if(correct){score++;addPoints();$('#rgbCheck').disabled=true;body.querySelectorAll('[data-rgb]').forEach(button=>button.disabled=true);$('#rgbNext').hidden=false}};
    $('#rgbNext').onclick=()=>{round++;render()};
  }
  render();
}
function licenseGame(){
  choiceMissionGame({deck:D.licenseMissions,topic:'GÖRSEL LİSANSI',question:item=>item.scene,display:()=>'<div class="mission-scene"><b>Görsel kullanımını düşün</b><p>İşareti, eserin kaynak sayfası ve kullanım amacıyla birlikte değerlendir.</p></div>',why:item=>item.why,finish:'Bu oyun temel işaretleri öğretir; gerçek bir görseli kullanmadan önce lisansı ve ilgili şartları kendi kaynak sayfasında doğrula. Emin değilsen kullanma veya hak sahibinden izin iste.'});
}
function accessibilityGame(){
  choiceMissionGame({deck:D.accessMissions,topic:'ERİŞİLEBİLİR TASARIM',question:item=>item.scene,display:()=>'<div class="mission-scene"><b>Herkes için tasarla</b><p>İçeriği farklı duyma, görme ve hareket etme biçimlerine göre düşün.</p></div>',why:item=>item.why,finish:'Küçük tasarım kararları daha çok kişinin öğrenmeye ve oyuna katılmasına yardım eder.'});
}
function cloudGame(){
  choiceMissionGame({deck:D.cloudMissions,topic:'BULUT & PAYLAŞIM',question:item=>item.scene,display:()=>'<div class="mission-scene"><b>Dosya yolunu seç</b><p>Paylaşım iznini, internet durumunu ve yedek kopyayı birlikte düşün.</p></div>',why:item=>item.why,finish:'Bulut eşitlemesi kullanışlıdır; erişimi sınırlamak ve ayrı yedek düşünmek dosyalarını korur.'});
}
function aiCheckGame(){
  choiceMissionGame({deck:D.aiCheckMissions,topic:'YAPAY ZEKÂ OKURYAZARLIĞI',question:item=>item.scene,display:()=>'<div class="mission-scene"><b>Merak et, sonra doğrula</b><p>Yapay zekâ yardımcı olabilir; ama her cevabı kanıt sayma.</p></div>',why:item=>item.why,finish:'Yapay zekâyı dikkatli kullan: özel bilgi paylaşma, önemli iddiaları kontrol et ve başkalarının emeğine saygı duy.'});
}
function gateOutput(gate,a,b){return gate==='AND'?a&b:gate==='OR'?a|b:gate==='NOT'?1-a:a^b}
function logicGates(){
  const deck=shuffled(D.gateMissions);let round=0,score=0,inputA=0,inputB=0,done=false;
  function render(){
    if(round>=deck.length){body.innerHTML=`<div class="success-box"><span>✦</span><h3>Devre ustası oldun!</h3><p>${score}/${deck.length} devreyi çalıştırdın. Mantık kapıları 0 ve 1 değerleriyle karar verir; gerçek işlemcilerde bu fikirler çok küçük elektrik devreleriyle uygulanır.</p><button class="action-button" id="gateAgain">Yeni devreler →</button></div>`;$('#gateAgain').onclick=logicGates;return}
    const item=deck[round];inputA=0;inputB=0;done=false;
    const target=item.target?'YANMALI':'SÖNMELİ';
    body.innerHTML=`${intro(`MANTIK DEVRESİ ${round+1}/${deck.length} · Anahtarları ayarla, devreyi çalıştır.`)}<div class="gate-board"><div class="gate-target">Hedef lamba <b>${target}</b></div><div class="gate-symbol">${item.gate==='AND'?'A ∧ B':item.gate==='OR'?'A ∨ B':item.gate==='NOT'?'¬ A':'A ⊕ B'}</div><div class="gate-inputs"><button class="gate-switch" data-gate="a" aria-pressed="false">A <b>0</b><span>Değiştir</span></button>${item.gate==='NOT'?'':`<button class="gate-switch" data-gate="b" aria-pressed="false">B <b>0</b><span>Değiştir</span></button>`}<span class="gate-arrow" aria-hidden="true">→</span><div class="gate-lamp" aria-label="Lamba sönük"><span>●</span><b>Lamba sönük</b></div></div></div><p class="feedback" aria-live="polite"></p><div class="row"><button class="action-button" id="gateCheck">Devreyi çalıştır</button><button class="action-button" id="gateNext" hidden>Sonraki devre →</button></div>`;
    const update=()=>{const value=gateOutput(item.gate,inputA,inputB),lamp=$('.gate-lamp');lamp.classList.toggle('on',Boolean(value));lamp.setAttribute('aria-label',value?'Lamba yanıyor':'Lamba sönük');lamp.querySelector('b').textContent=value?'Lamba yanıyor':'Lamba sönük'};
    body.querySelectorAll('[data-gate]').forEach(button=>button.onclick=()=>{if(done)return;const key=button.dataset.gate;if(key==='a')inputA=1-inputA;else inputB=1-inputB;const value=key==='a'?inputA:inputB;button.setAttribute('aria-pressed',String(Boolean(value)));button.querySelector('b').textContent=String(value);update();$('.feedback').textContent=''});
    $('#gateCheck').onclick=()=>{if(done)return;const value=gateOutput(item.gate,inputA,inputB);if(value===item.target){done=true;score++;addPoints();$('.feedback').textContent=`Doğru! ${item.why}`;body.querySelectorAll('.gate-switch').forEach(button=>button.disabled=true);$('#gateCheck').disabled=true;$('#gateNext').hidden=false;$('#gateNext').onclick=()=>{round++;render()}}else{$('.feedback').textContent=`Henüz değil. ${item.why} Anahtarları değiştirip tekrar dene.`}};
    update();
  }
  render();
}
function networkRoutes(){
  const deck=shuffled(D.routeMissions);let round=0,score=0,answered=false;
  function render(){
    if(round>=deck.length){body.innerHTML=`<div class="success-box"><span>✦</span><h3>Ağ rotaları tamamlandı!</h3><p>${score}/${deck.length} doğru araç seçtin. Ağ cihazlarının görevleri farklıdır; gerçek ağlarda modem ve yönlendirici tek kutuda birleşebilir.</p><button class="action-button" id="routeAgain">Yeni rotalar →</button></div>`;$('#routeAgain').onclick=networkRoutes;return}
    const item=deck[round],choices=shuffled(item.options.map((label,index)=>({label,index})));answered=false;
    body.innerHTML=`${intro(`AĞ ROTASI ${round+1}/${deck.length} · Veriye doğru yolu kur.`)}<div class="question">${item.question}</div><div class="route-map"><div class="route-end">${item.start}</div><span class="route-line" aria-hidden="true">→</span><div class="route-choices" role="group" aria-label="Aradaki ağ aracını seç">${choices.map((choice,index)=>`<button class="route-node" data-route-choice="${index}">${choice.label}</button>`).join('')}</div><span class="route-line" aria-hidden="true">→</span><div class="route-end">${item.end}</div></div><p class="feedback" aria-live="polite"></p><button class="action-button" id="routeNext" hidden>Sonraki rota →</button>`;
    body.querySelectorAll('[data-route-choice]').forEach(button=>button.onclick=()=>{if(answered)return;answered=true;const choice=choices[Number(button.dataset.routeChoice)],correct=choice.index===item.ok;button.classList.add(correct?'correct':'wrong');body.querySelectorAll('[data-route-choice]').forEach(option=>option.disabled=true);$('.feedback').textContent=(correct?'Rota tamamlandı! ':'Rotayı yeniden düşün: ')+item.why;if(correct){score++;addPoints()}$('#routeNext').hidden=false;$('#routeNext').onclick=()=>{round++;render()}});
  }
  render();
}
function runMicroGame(pack){
  if(pack.kind==='choice'){
    choiceMissionGame({deck:pack.missions,topic:pack.topic,question:item=>item.scene,display:()=>`<div class="mission-scene"><b>${pack.title}</b><p>${pack.desc}</p></div>`,why:item=>item.why,finish:`${pack.title} tamamlandı! Öğrendiğin bilgiyi yeni bir durumda da düşün.`});
    return;
  }
  if(pack.kind==='order'){runOrderPack(pack);return}
  if(pack.kind==='sort'){runSortPack(pack);return}
  if(pack.kind==='match'){runMatchPack(pack);return}
  if(pack.kind==='wordsearch'){runWordSearchPack(pack);return}
  if(pack.kind==='riddle')runRiddlePack(pack);
}
function runWordSearchPack(pack){
  const size=pack.size||8,terms=shuffled(pack.terms).map(term=>({...term,word:term.word.toLocaleUpperCase('tr-TR')}));
  let grid=null,found=new Set(),selected=[],direction=null;
  // Place longer words first; matching letters may be shared where words cross.
  function buildGrid(){
    const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
    for(let attempt=0;attempt<60;attempt++){
      const cells=Array.from({length:size*size},()=>null),ordered=shuffled(terms).sort((a,b)=>b.word.length-a.word.length);let placed=true;
      for(const term of ordered){
        const letters=[...term.word],candidates=[];
        for(let row=0;row<size;row++)for(let col=0;col<size;col++)for(const [dy,dx] of dirs){
          const endRow=row+dy*(letters.length-1),endCol=col+dx*(letters.length-1);
          if(endRow<0||endRow>=size||endCol<0||endCol>=size)continue;
          const path=letters.map((_,index)=>(row+dy*index)*size+col+dx*index);
          if(path.every((cell,index)=>cells[cell]===null||cells[cell]===letters[index]))candidates.push({path,letters});
        }
        if(!candidates.length){placed=false;break}
        const choice=shuffled(candidates)[0];choice.path.forEach((cell,index)=>{cells[cell]=choice.letters[index]});
      }
      if(placed){grid=cells;break}
    }
    if(!grid){grid=Array(size*size).fill(null);terms.forEach((term,row)=>[...term.word].forEach((letter,col)=>{grid[row*size+col]=letter}))}
    const alphabet=[...'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'];grid=grid.map(letter=>letter||alphabet[Math.floor(Math.random()*alphabet.length)]);
  }
  function render(){
    if(found.size===terms.length){body.innerHTML=`<div class="success-box"><span>✦</span><h3>${pack.title} tamamlandı!</h3><p>Web sayfasının yapısı, görünümü ve bağlantıları hakkında ${found.size} kavram buldun.</p><button class="action-button" id="wordSearchAgain">Yeni tablo oluştur</button></div>`;$('#wordSearchAgain').onclick=()=>runWordSearchPack(pack);return}
    buildGrid();found=new Set();selected=[];direction=null;
    body.innerHTML=`${intro(`${pack.title.toLocaleUpperCase('tr-TR')} · ${found.size}/${terms.length} kavram`)}<div class="mission-scene"><b>Kelime avı</b><p>Bir harfe, sonra yatay veya dikey komşularına sırayla dokun. Klavyede oklarla ilerle, Enter veya boşlukla seç. İpucundaki kavramı bul; yolu temizlemek istersen düğmeye bas.</p></div><div class="wordsearch-clues" aria-label="Kavram ipuçları">${terms.map((term,index)=>`<div class="wordsearch-clue" data-word-clue="${index}"><span>${term.clue}</span><b hidden>${term.word}</b></div>`).join('')}</div><div class="wordsearch-scroll"><div class="wordsearch-grid" role="group" aria-label="${size} satır ve ${size} sütunlu harf tablosu">${grid.map((letter,index)=>`<button class="wordsearch-cell" type="button" data-word-cell="${index}" tabindex="${index===0?'0':'-1'}" aria-pressed="false" aria-label="${Math.floor(index/size)+1}. satır, ${index%size+1}. sütun, ${letter}">${letter}</button>`).join('')}</div></div><div class="row"><button class="action-button" id="wordSearchClear">Seçimi temizle</button></div><p class="feedback" aria-live="polite">Bulunan: ${found.size}/${terms.length}</p>`;
    const cellButtons=Array.from(body.querySelectorAll('[data-word-cell]'));
    const clearPath=()=>{selected=[];direction=null;cellButtons.forEach(button=>{button.classList.remove('selected');button.setAttribute('aria-pressed','false')})};
    const announce=message=>{$('.feedback').textContent=message};
    $('#wordSearchClear').onclick=()=>{clearPath();announce(`Seçim temizlendi. Bulunan: ${found.size}/${terms.length}`)};
    // Keep one tab stop in the 8×8 grid; arrow keys move that stop by one cell.
    cellButtons.forEach(button=>button.addEventListener('keydown',event=>{const movement={ArrowUp:-size,ArrowDown:size,ArrowLeft:-1,ArrowRight:1}[event.key];if(movement===undefined)return;const current=Number(button.dataset.wordCell),target=current+movement;if(target<0||target>=cellButtons.length||(movement===-1&&current%size===0)||(movement===1&&current%size===size-1))return;event.preventDefault();button.tabIndex=-1;cellButtons[target].tabIndex=0;cellButtons[target].focus()}));
    cellButtons.forEach(button=>button.onclick=()=>{
      const index=Number(button.dataset.wordCell);
      if(!selected.length){selected=[index];button.classList.add('selected');button.setAttribute('aria-pressed','true');announce('Sıradaki harflere yatay veya dikey ilerle.');return}
      if(selected.includes(index)){clearPath();selected=[index];button.classList.add('selected');button.setAttribute('aria-pressed','true');announce('Yeni bir başlangıç seçildi.');return}
      const prior=selected[selected.length-1],row=Math.floor(prior/size),col=prior%size,nextRow=Math.floor(index/size),nextCol=index%size,step=[nextRow-row,nextCol-col];
      if(Math.abs(step[0])+Math.abs(step[1])!==1||(direction&&(step[0]!==direction[0]||step[1]!==direction[1]))){clearPath();selected=[index];button.classList.add('selected');button.setAttribute('aria-pressed','true');announce('Düz bir yatay veya dikey yol seç; yeni başlangıç alındı.');return}
      if(!direction)direction=step;selected.push(index);button.classList.add('selected');button.setAttribute('aria-pressed','true');
      const sequence=selected.map(cell=>grid[cell]).join(''),reverse=[...sequence].reverse().join('');
      const match=terms.find(term=>!found.has(term.word)&&(term.word===sequence||term.word===reverse));
      if(match){found.add(match.word);selected.forEach(cell=>{const tile=cellButtons[cell];tile.dataset.wordFound='true';tile.classList.remove('selected');tile.classList.add('found');tile.setAttribute('aria-pressed','false')});const clue=terms.indexOf(match),clueCard=body.querySelector(`[data-word-clue="${clue}"]`);clueCard.classList.add('found');clueCard.querySelector('b').hidden=false;addPoints();$('.game-intro').textContent=`${pack.title.toLocaleUpperCase('tr-TR')} · ${found.size}/${terms.length} kavram`;selected=[];direction=null;announce(`Buldun: ${match.word} — ${match.clue} · ${found.size}/${terms.length}`);if(found.size===terms.length)render();return}
      const possible=terms.some(term=>!found.has(term.word)&&(term.word.startsWith(sequence)||term.word.endsWith(reverse)));
      if(possible)announce(`Güzel, devam et. Bulunan: ${found.size}/${terms.length}`);else{clearPath();announce(`Bu dizilim bir kavram değil. Yeni bir yol dene. Bulunan: ${found.size}/${terms.length}`)}
    });
  }
  render();
}
function runMatchPack(pack){
  const cards=shuffled(pack.pairs.flatMap((pair,pairId)=>pair.map((label,side)=>({pairId,side,label}))));
  let first=null,locked=false,matches=0,attempts=0;
  function render(){
    if(matches===pack.pairs.length){body.innerHTML=`<div class="success-box"><span>✦</span><h3>${pack.title} tamamlandı!</h3><p>${matches} kavram çiftini ${attempts} denemede eşleştirdin. Kavramla görevini birlikte hatırlamak öğrenmeyi destekler.</p><button class="action-button" id="matchAgain">Yeniden oyna</button></div>`;$('#matchAgain').onclick=()=>runMatchPack(pack);return}
    body.innerHTML=`${intro(`${pack.title.toLocaleUpperCase('tr-TR')} · ${matches}/${pack.pairs.length} çift`)}<div class="mission-scene"><b>Nasıl oynanır?</b><p>İki karta dokun. Kavram ile açıklaması eşleşiyorsa açık kalır; değilse kartları yeniden dene.</p></div><div class="match-grid" role="group" aria-label="Eşleşme kartları">${cards.map((card,index)=>`<button class="match-card" type="button" data-match-card="${index}" aria-pressed="false" aria-label="${index+1}. kapalı kart">?</button>`).join('')}</div><p class="feedback" aria-live="polite">${matches} eşleşme bulundu.</p>`;
    body.querySelectorAll('[data-match-card]').forEach(button=>button.onclick=()=>{
      if(locked||button.dataset.matched==='true'||button===first)return;
      const card=cards[Number(button.dataset.matchCard)];button.textContent=card.label;button.setAttribute('aria-label',card.label);button.setAttribute('aria-pressed','true');
      if(!first){first=button;return}
      attempts++;const firstCard=cards[Number(first.dataset.matchCard)];
      if(firstCard.pairId===card.pairId&&firstCard.side!==card.side){matches++;addPoints();first.dataset.matched='true';button.dataset.matched='true';first.classList.add('matched');button.classList.add('matched');$('.game-intro').textContent=`${pack.title.toLocaleUpperCase('tr-TR')} · ${matches}/${pack.pairs.length} çift`;$('.feedback').textContent=`Eşleşti! ${matches}/${pack.pairs.length} çift.`;first=null;if(matches===pack.pairs.length)render()}
      else{locked=true;$('.feedback').textContent='Bu iki kart eşleşmedi. Birazdan kapanacak; yeniden dene.';const previous=first;setTimeout(()=>{for(const item of [previous,button]){item.textContent='?';item.setAttribute('aria-label',`${Number(item.dataset.matchCard)+1}. kapalı kart`);item.setAttribute('aria-pressed','false')}first=null;locked=false},850)}
    });
  }
  render();
}
function runOrderPack(pack){
  let round=0,score=0,selected=[];
  function render(){
    if(round>=pack.missions.length){body.innerHTML=`<div class="success-box"><span>✦</span><h3>${pack.title} tamamlandı!</h3><p>${score}/${pack.missions.length} adımı doğru sıraladın. Bir planı küçük ve anlaşılır adımlara bölmek hata bulmayı kolaylaştırır.</p><button class="action-button" id="orderAgain">Yeniden oyna</button></div>`;$('#orderAgain').onclick=()=>runOrderPack(pack);return}
    const item=pack.missions[round];selected=[];
    body.innerHTML=`${intro(`${pack.title.toLocaleUpperCase('tr-TR')} · GÖREV ${round+1}/${pack.missions.length}`)}<div class="mission-scene"><b>${pack.title}</b><p>${item.scene}</p></div><h3 class="order-label">Adımları doğru sıraya ekle</h3><div class="order-workspace" role="list" aria-label="Seçtiğin adımlar"></div><div class="order-options" role="group" aria-label="Seçilebilecek adımlar">${shuffled(item.solution).map((step,index)=>`<button class="order-option" data-order-option="${index}">${step}</button>`).join('')}</div><p class="feedback" aria-live="polite"></p><div class="row"><button class="action-button" id="orderCheck">Sırayı kontrol et</button><button class="action-button" id="orderReset">Temizle</button><button class="action-button" id="orderNext" hidden>Sonraki görev →</button></div>`;
    const draw=()=>{const area=$('.order-workspace');area.innerHTML=selected.length?selected.map((step,index)=>`<button class="order-chip" data-order-remove="${index}" aria-label="${index+1}. sıradaki ${step}; kaldır">${index+1}. ${step} ×</button>`).join(''):'<span class="muted">Adım seçince burada görünür.</span>';body.querySelectorAll('[data-order-option]').forEach(button=>{button.disabled=selected.includes(button.textContent)});area.querySelectorAll('[data-order-remove]').forEach(button=>button.onclick=()=>{selected.splice(Number(button.dataset.orderRemove),1);draw()})};
    body.querySelectorAll('[data-order-option]').forEach(button=>button.onclick=()=>{if(selected.length<item.solution.length){selected.push(button.textContent);draw();$('.feedback').textContent=''}});
    $('#orderReset').onclick=()=>{selected=[];draw();$('.feedback').textContent=''};
    $('#orderCheck').onclick=()=>{const correct=selected.length===item.solution.length&&selected.every((step,index)=>step===item.solution[index]);if(correct){score++;addPoints();$('.feedback').textContent=`Doğru sıra! ${item.why}`;body.querySelectorAll('[data-order-option],[data-order-remove]').forEach(button=>button.disabled=true);$('#orderCheck').disabled=true;$('#orderReset').disabled=true;$('#orderNext').hidden=false;$('#orderNext').onclick=()=>{round++;render()}}else $('.feedback').textContent=selected.length<item.solution.length?'Önce tüm adımları sıraya koy. '+item.why:'Sıralamayı bir daha düşün. İstersen adımlara dokunup yerlerini değiştir veya temizle. '+item.why};
    draw();
  }
  render();
}
function runSortPack(pack){
  const items=shuffled(pack.items);let index=0,score=0,answered=false;
  function render(){
    if(index>=items.length){body.innerHTML=`<div class="success-box"><span>✦</span><h3>${pack.title} tamamlandı!</h3><p>${score}/${items.length} kartı doğru sınıfa yerleştirdin. Benzer özellikleri bulup sınıflandırmak bilgiyi düzenlemeye yardım eder.</p><button class="action-button" id="sortPackAgain">Yeniden oyna</button></div>`;$('#sortPackAgain').onclick=()=>runSortPack(pack);return}
    const item=items[index];answered=false;
    body.innerHTML=`${intro(`${pack.title.toLocaleUpperCase('tr-TR')} · KART ${index+1}/${items.length}`)}<div class="sort-prompt"><span>Bu kart hangi grupta?</span><b>${item.text}</b></div><div class="sort-categories" role="group" aria-label="${item.text} için bir kategori seç">${pack.categories.map(category=>`<button class="sort-category" data-sort-category="${category}">${category}</button>`).join('')}</div><p class="feedback" aria-live="polite"></p><button class="action-button" id="sortPackNext" hidden>Sonraki kart →</button>`;
    body.querySelectorAll('[data-sort-category]').forEach(button=>button.onclick=()=>{if(answered)return;const correct=button.dataset.sortCategory===item.category;if(correct){answered=true;score++;addPoints();button.classList.add('correct');$('.feedback').textContent=`Doğru sınıf! ${item.why}`;body.querySelectorAll('[data-sort-category]').forEach(option=>option.disabled=true);$('#sortPackNext').hidden=false;$('#sortPackNext').onclick=()=>{index++;render()}}else $('.feedback').textContent='Bir ipucu daha düşün; kartın ne işe yaradığını veya ne anlattığını incele.'});
  }
  render();
}
function runRiddlePack(pack){
  let index=0,score=0;
  function normalize(value){return value.normalize('NFC').trim().replace(/[.!?,;:]+$/g,'').replace(/\s+/g,' ').toLocaleLowerCase('tr-TR')}
  function render(){
    if(index>=pack.missions.length){body.innerHTML=`<div class="success-box"><span>✦</span><h3>${pack.title} çözüldü!</h3><p>${score}/${pack.missions.length} kavramı buldun. İpuçlarını kullanıp kendi cevabını üretmek hatırlamayı güçlendirir.</p><button class="action-button" id="riddleAgain">Yeni bulmacalar →</button></div>`;$('#riddleAgain').onclick=()=>runRiddlePack(pack);return}
    const riddle=pack.missions[index];
    body.innerHTML=`${intro(`${pack.title.toLocaleUpperCase('tr-TR')} · BULMACA ${index+1}/${pack.missions.length}`)}<div class="mission-scene"><b>İpucu</b><p>${riddle.clue}</p></div><label class="riddle-label" for="riddleAnswer">Cevabını yaz</label><input class="text-input" id="riddleAnswer" type="text" autocomplete="off" aria-label="Bulmaca cevabın"><p class="feedback" aria-live="polite"></p><button class="action-button" id="riddleCheck">Cevabı kontrol et</button><button class="action-button" id="riddleNext" hidden>Sonraki bulmaca →</button>`;
    const check=()=>{const field=$('#riddleAnswer');if(riddle.answer.some(answer=>normalize(answer)===normalize(field.value))){score++;addPoints();$('.feedback').textContent='Bildin! Güzel ipucu takibi.';field.disabled=true;$('#riddleCheck').disabled=true;$('#riddleNext').hidden=false;$('#riddleNext').onclick=()=>{index++;render()}}else $('.feedback').textContent='Bu cevap eşleşmedi. İpucundaki görevi yeniden düşün ve bir daha dene.'};
    $('#riddleCheck').onclick=check;$('#riddleAnswer').addEventListener('keydown',event=>{if(event.key==='Enter')check()});
  }
  render();
}
function choiceMissionGame({deck,topic,question,display,why,finish}){
  let round=0,score=0,answered=false;
  function render(){
    if(round>=deck.length){body.innerHTML=`<div class="success-box"><span>✦</span><h3>Görev dizisi tamamlandı!</h3><p>${score}/${deck.length} doğru seçim yaptın. ${finish}</p><button class="action-button" id="missionAgain">Yeni görevler →</button></div>`;$('#missionAgain').onclick=()=>choiceMissionGame({deck:shuffled(deck),topic,question,display,why,finish});return}
    const item=deck[round],choices=shuffled(item.options.map((text,index)=>({text,index})));answered=false;
    body.innerHTML=`${intro(`${topic} GÖREVİ ${round+1}/${deck.length} · Düşün, seç ve açıklamayı incele.`)}${display(item)}<div class="question">${question(item)}</div><div class="answers">${choices.map((choice,index)=>`<button class="answer-button" data-mission-choice="${index}">${choice.text}</button>`).join('')}</div><p class="feedback" aria-live="polite"></p><button class="action-button" id="missionNext" hidden>Sonraki görev →</button>`;
    body.querySelectorAll('[data-mission-choice]').forEach(button=>button.onclick=()=>{if(answered)return;answered=true;const choice=choices[Number(button.dataset.missionChoice)],correct=choice.index===item.ok;button.classList.add(correct?'correct':'wrong');body.querySelectorAll('[data-mission-choice]').forEach(option=>option.disabled=true);$('.feedback').textContent=(correct?'Doğru seçim! ':'Bir ipucu: ')+why(item);if(correct){score++;addPoints()}$('#missionNext').hidden=false;$('#missionNext').onclick=()=>{round++;render()}});
  }
  render();
}
function resetGameSession(){for(const key of Object.keys(body.dataset))delete body.dataset[key];selectedSort=null;if(activeTimer)clearTimeout(activeTimer);activeTimer=null}
function openGame(id){const g=games.find(x=>x.id===id);if(!g)return;resetGameSession();$('#gameTitle').textContent=g.title;$('#gameEyebrow').textContent=`${g.topic} İSTASYONU`;body.innerHTML='';g.run();dialog.showModal()}
function addPoints(n=1){points+=n;try{localStorage.setItem('merak-points',String(points))}catch{}$('#scoreTotal').textContent=String(points)}
function intro(t){return `<p class="game-intro">${t}</p>`}function feedback(){return '<p class="feedback" aria-live="polite"></p>'}
function quizRound(pool,done){let answered=false;const q=pool[Math.floor(Math.random()*pool.length)],choices=q.a.map((text,index)=>({text,index})).sort(()=>Math.random()-.5);body.innerHTML=`${intro('Sakin sakin düşün; her cevap sana yeni bir ipucu verir.')}<div class="question">${q.q}</div><div class="answers">${choices.map(x=>`<button class="answer-button" data-a="${x.index}">${x.text}</button>`).join('')}</div>${feedback()}<div class="row"><button class="action-button next-question" hidden>Devam et →</button></div>`;body.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{if(answered)return;answered=true;const ok=Number(b.dataset.a)===q.ok;b.classList.add(ok?'correct':'wrong');body.querySelectorAll('[data-a]').forEach(x=>x.disabled=true);body.querySelector('.feedback').textContent=(ok?'Harika! ':'Bir ipucu daha: ')+q.why;if(ok)addPoints();const next=body.querySelector('.next-question');next.hidden=false;next.onclick=()=>done?done(ok):quizRound(pool,done)});}
function wheel(){body.innerHTML=`${intro('Çark bir konu seçsin; ardından o başlıktan bir mini soru gelsin.')}<div class="wheel-wrap"><div class="wheel" id="wheel"></div><button class="action-button" id="spin">Çarkı çevir</button><div class="big-result" id="wheelResult" aria-live="polite"></div></div>`;$('#spin').onclick=()=>{const w=$('#wheel'),c=D.categories[Math.floor(Math.random()*D.categories.length)];w.classList.remove('spinning');void w.offsetWidth;w.classList.add('spinning');$('#spin').disabled=true;activeTimer=setTimeout(()=>{$('#wheelResult').textContent=c+' seçildi!';const pool=D.quiz.filter(q=>q.cat===c);activeTimer=setTimeout(()=>quizRound(pool.length?pool:D.quiz,()=>wheel()),500)},750)}}
function boxes(){
  const picks=D.boxes.slice().sort(()=>Math.random()-.5).slice(0,3);
  body.innerHTML=`${intro('Bir kutu seç. İçindeki ipucu seni gizli bilişim kavramına götürecek.')}<div class="box-grid">${picks.map((_,index)=>`<button class="mystery-box" data-box="${index}" aria-label="${index+1}. gizemli kutuyu aç">▣</button>`).join('')}</div><div id="boxClue" class="question" aria-live="polite"></div><div id="boxAnswer" class="answers"></div>${feedback()}`;
  body.querySelectorAll('[data-box]').forEach(button=>button.onclick=()=>{
    if(button.disabled)return;
    const question=picks[Number(button.dataset.box)];
    button.disabled=true;button.textContent='✦';$('#boxClue').textContent=question.hint;
    $('#boxAnswer').innerHTML=`<label class="muted" for="boxInput">Tahminini yaz:</label><div class="row"><input id="boxInput" class="text-input" autocomplete="off" aria-label="Kavram tahminin"><button id="boxCheck" class="action-button">Kontrol et</button></div>`;
    const check=()=>{
      const answer=$('#boxInput').value.normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('tr');
      const correct=answer===question.answer.normalize('NFC').toLocaleLowerCase('tr');
      $('.feedback').textContent=(correct?'Buldun! ':'Doğru kavram: '+question.answer+'. ')+question.why;
      if(correct)addPoints();
      $('#boxAnswer').innerHTML='<button class="action-button" id="boxAgain">Başka kutu seç →</button>';
      $('#boxAgain').onclick=boxes;
    };
    $('#boxCheck').onclick=check;
    $('#boxInput').addEventListener('keydown',event=>{if(event.key==='Enter')check()});
  });
}
function sort(){
  const items=D.sort.slice().sort(()=>Math.random()-.5),placed={};
  body.innerHTML=`${intro('Bir araca dokunarak seç, sonra doğru gruba dokun. İstersen sürükle.')}<div class="sort-list" id="sortItems">${items.map((item,index)=>`<button class="sort-item" draggable="true" data-item="${index}">${item.item}</button>`).join('')}</div><p class="muted">Gruplar</p><div class="sort-targets">${['Giriş birimi','Çıkış birimi'].map(bin=>`<div class="sort-bin" data-bin="${bin}" tabindex="0" role="button" aria-label="${bin} grubuna yerleştir"><strong>${bin}</strong><div></div></div>`).join('')}</div>${feedback()}<button class="action-button" id="sortCheck">Yerleştirmeyi kontrol et</button>`;
  body.querySelectorAll('.sort-item').forEach(item=>{
    item.onclick=()=>{body.querySelectorAll('.sort-item').forEach(card=>card.classList.remove('selected'));selectedSort=item;item.classList.add('selected')};
    item.ondragstart=event=>event.dataTransfer.setData('text/plain',item.dataset.item);
  });
  body.querySelectorAll('.sort-bin').forEach(bin=>{
    bin.onclick=()=>{if(selectedSort)place(selectedSort,bin)};
    bin.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();bin.click()}};
    bin.ondragover=event=>event.preventDefault();
    bin.ondrop=event=>{event.preventDefault();const item=body.querySelector(`[data-item="${event.dataTransfer.getData('text/plain')}"]`);if(item)place(item,bin)};
  });
  function place(item,bin){placed[item.dataset.item]=bin.dataset.bin;bin.querySelector('div').append(item);item.classList.remove('selected');selectedSort=null}
  $('#sortCheck').onclick=()=>{const correct=items.every((item,index)=>placed[index]===item.bin);$('.feedback').textContent=correct?'Mükemmel sınıflandırma! Giriş veriyi içeri alır, çıkış sonucu bize ulaştırır.':'Bazı araçlar yerini karıştırmış olabilir. Mikrofon ve klavye giriş; ekran, yazıcı ve hoparlör çıkıştır.';if(correct){addPoints();$('#sortCheck').disabled=true;body.querySelectorAll('.sort-item').forEach(button=>button.disabled=true)}};
}
function race(){
  let questionIndex=0;
  body.innerHTML=`${intro('Her doğru yanıt arabanı bitişe yaklaştırır. Refleks değil, bilgi yarışı!')}<div class="race-track"><span id="raceCar" class="race-car">🚙</span></div><div class="progress-line"><span id="raceProgress"></span></div><div id="raceQuestion"></div>`;
  function showQuestion(){
    if(questionIndex>=D.race.length){
      body.innerHTML=`<div class="success-box"><span>🏁</span><h3>Bitiş çizgisine ulaştın!</h3><p>Bilgiyle ilerledin; her doğru cevapta yeni bir şey öğrendin.</p><button class="action-button" id="raceAgain">Tekrar yarış</button></div>`;
      $('#raceAgain').onclick=race;addPoints(2);return;
    }
    const q=D.race[questionIndex],choices=q.a.map((text,index)=>({text,index})).sort(()=>Math.random()-.5);
    $('#raceQuestion').innerHTML=`<div class="question">${q.q}</div><div class="answers">${choices.map(x=>`<button class="answer-button" data-ra="${x.index}">${x.text}</button>`).join('')}</div>${feedback()}<button class="action-button" id="raceContinue" hidden>Devam et →</button>`;
    body.querySelectorAll('[data-ra]').forEach(button=>button.onclick=()=>{
      if(body.dataset.raceAnswered)return;
      body.dataset.raceAnswered='1';
      const correct=Number(button.dataset.ra)===q.ok;
      body.querySelectorAll('[data-ra]').forEach(option=>option.disabled=true);
      button.classList.add(correct?'correct':'wrong');
      $('.feedback').textContent=(correct?'Harika sürüş! ':'Araba bekliyor. ')+q.why;
      const next=$('#raceContinue');
      next.hidden=false;
      if(correct){
        questionIndex++;addPoints();
        $('#raceCar').style.left=`${3+questionIndex*(82/D.race.length)}%`;
        $('#raceProgress').style.width=`${questionIndex/D.race.length*100}%`;
        next.textContent='Devam et →';
      }else{
        next.textContent='Bir daha dene →';
      }
      next.onclick=()=>{delete body.dataset.raceAnswered;showQuestion()};
    });
  }
  $('#raceCar').style.left='3%';$('#raceProgress').style.width='0%';showQuestion();
}
function word(){const item=D.words[Math.floor(Math.random()*D.words.length)],word=item.word,used=new Set();let lives=6;function render(){body.innerHTML=`${intro('İpucunu oku, harfleri seç. Robotun enerji hücrelerini koru!')}<div class="question">${item.hint}</div><div class="lives">${'♥ '.repeat(lives)}${'♡ '.repeat(6-lives)} · ${lives} enerji</div><div class="letters">${[...word].map(ch=>`<span class="letter-tile">${used.has(ch)?ch:'&nbsp;'}</span>`).join('')}</div><div class="letter-keyboard">${'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('').map(ch=>`<button data-letter="${ch}" ${used.has(ch)?'disabled':''}>${ch}</button>`).join('')}</div>${feedback()}`;body.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>{const ch=b.dataset.letter;used.add(ch);if(!word.includes(ch))lives--;if([...word].every(x=>used.has(x))){$('.feedback').textContent='Kelimeyi çözdün! '+item.word+' — bilişimde harika bir keşif.';addPoints();body.querySelectorAll('[data-letter]').forEach(x=>x.disabled=true)}else if(lives<=0){$('.feedback').textContent='Robot dinleniyor! Aradığımız kelime: '+item.word+'. İpucunu aklında tut.';body.querySelectorAll('[data-letter]').forEach(x=>x.disabled=true)}else render()})}render()}
function sequence(){let seq=[];body.innerHTML=`${intro('Robot yalnızca sıraladığın komutları uygular. Yıldızın yanına ulaşması için doğru sırayı kur.')}<div class="question">${D.sequence.goal}</div><div class="sequence-area" id="sequenceArea" aria-label="Komut dizisi boş"></div><div class="sequence-options">${D.sequence.options.map(x=>`<button data-cmd="${x}">${x}</button>`).join('')}</div><div class="row" style="margin-top:14px"><button class="action-button" id="runSequence">▶ Komutları çalıştır</button><button class="choice-button" id="clearSequence">Temizle</button></div>${feedback()}<div class="muted" id="robotResult"></div>`;body.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>{seq.push(b.dataset.cmd);renderSeq()});function renderSeq(){$('#sequenceArea').innerHTML=seq.map((x,i)=>`<button data-remove="${i}" aria-label="${x} komutunu kaldır">${i+1}. ${x} ×</button>`).join('');body.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{seq.splice(Number(b.dataset.remove),1);renderSeq()})}$('#clearSequence').onclick=()=>{seq=[];renderSeq();$('.feedback').textContent=''};$('#runSequence').onclick=()=>{const ok=JSON.stringify(seq)===JSON.stringify(D.sequence.solution);$('#robotResult').textContent=ok?'🤖 Robot ilerledi: ⭐ Hedefe ulaştı!':'🤖 Robot bu sırayla hedefi bulamadı. Her komutun yönünü ve sırasını tekrar düşün.';$('.feedback').textContent=ok?'Algoritman çalıştı!':'Bir kez daha dene; komutları değiştirebilirsin.';if(ok){if(body.dataset.sequenceRewarded!=='1'){body.dataset.sequenceRewarded='1';addPoints()}$('#runSequence').disabled=true;$('#clearSequence').disabled=true;body.querySelectorAll('[data-cmd],[data-remove]').forEach(button=>button.disabled=true)}}}
function detective(){body.innerHTML=intro('Bir vakayı seç, dijital izleri incele ve en güvenli kararı ver.');const pick=D.detective.slice().sort(()=>Math.random()-.5).slice(0,3);let i=0,score=0;function next(){if(i>=pick.length){body.innerHTML=`<div class="success-box"><span>🕵️</span><h3>Vaka tamamlandı!</h3><p>${score}/${pick.length} güvenli seçim. İyi bir dijital dedektif, şüpheli durumda durup düşünür ve yardım ister.</p><button class="action-button" id="detectiveAgain">Yeni vaka seti →</button></div>`;$('#detectiveAgain').onclick=detective;if(score)addPoints(score);return}const q=pick[i++],choices=q.a.map((text,index)=>({text,index})).sort(()=>Math.random()-.5);body.innerHTML=`${intro(`VAKA ${i} / ${pick.length} · İpucunu dikkatle oku.`)}<div class="question">${q.q}</div><div class="answers">${choices.map(x=>`<button class="answer-button" data-da="${x.index}">${x.text}</button>`).join('')}</div>${feedback()}<button class="action-button" id="detectiveNext" hidden>Sonraki vaka →</button>`;body.querySelectorAll('[data-da]').forEach(b=>b.onclick=()=>{if(body.dataset.answered)return;body.dataset.answered='1';const ok=Number(b.dataset.da)===q.ok;if(ok)score++;b.classList.add(ok?'correct':'wrong');body.querySelectorAll('[data-da]').forEach(x=>x.disabled=true);$('.feedback').textContent=(ok?'İyi yakaladın! ':'İpucu: ')+q.why;$('#detectiveNext').hidden=false;$('#detectiveNext').onclick=()=>{delete body.dataset.answered;next()}})}next()}
})();
