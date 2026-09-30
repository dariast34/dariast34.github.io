/* Optional UI tones are synthesized locally; no audio files or network calls. */
(()=>{
  const toggle=document.querySelector('#soundToggle');
  if(!toggle)return;
  let enabled=false,context;
  function tone(frequency=660){
    if(!enabled)return;
    try{
      context??=new AudioContext();
      const oscillator=context.createOscillator(),gain=context.createGain();
      oscillator.frequency.value=frequency;
      oscillator.type='sine';
      gain.gain.setValueAtTime(.035,context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.11);
      oscillator.connect(gain);gain.connect(context.destination);
      oscillator.start();oscillator.stop(context.currentTime+.12);
    }catch{}
  }
  toggle.addEventListener('click',()=>{
    enabled=!enabled;
    toggle.setAttribute('aria-pressed',String(enabled));
    toggle.querySelector('span').textContent=enabled?'Ses açık':'Ses kapalı';
    if(enabled)tone(790);
  });
  document.addEventListener('click',event=>{
    if(event.target.closest('.answer-button,.mystery-box,.letter-keyboard button,.sequence-options button,.action-button'))tone(620);
  });
})();
