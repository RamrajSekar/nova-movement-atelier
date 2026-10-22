(()=>{
const track=document.querySelector('.expertise-grid'),controls=document.querySelector('.expertise-carousel-controls');
if(!track||!controls)return;
const cards=[...track.querySelectorAll('.service')],prev=controls.querySelector('[data-prev]'),next=controls.querySelector('[data-next]'),status=controls.querySelector('[data-status]');
const mobile=matchMedia('(max-width:800px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');let current=0,frame;
track.dataset.carouselReady='true';track.id='expertise-carousel';
for(const button of [prev,next])button.setAttribute('aria-controls',track.id);
cards.forEach((card,i)=>{card.setAttribute('role','group');card.setAttribute('aria-label',`${i+1} of ${cards.length}: ${card.querySelector('h3').textContent}`);});
const positions=()=>{const left=track.getBoundingClientRect().left,max=track.scrollWidth-track.clientWidth;return cards.map(card=>Math.max(0,Math.min(max,card.getBoundingClientRect().left-left+track.scrollLeft)));};
const sync=()=>{const offsets=positions();current=offsets.reduce((best,x,i)=>Math.abs(x-track.scrollLeft)<Math.abs(offsets[best]-track.scrollLeft)?i:best,0);status.textContent=`${current+1} of ${cards.length}`;prev.disabled=current===0;next.disabled=current===cards.length-1;};
const go=index=>{if(!mobile.matches)return;track.scrollTo({left:positions()[Math.max(0,Math.min(cards.length-1,index))],behavior:reduced.matches?'instant':'smooth'});};
prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));
track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(sync);},{passive:true});
track.addEventListener('keydown',event=>{if(!mobile.matches||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();go(event.key==='Home'?0:event.key==='End'?cards.length-1:current+(event.key==='ArrowRight'?1:-1));});
track.addEventListener('focusin',event=>{if(!mobile.matches)return;const card=event.target.closest('.service');if(card)go(cards.indexOf(card));});
const layout=()=>{controls.hidden=!mobile.matches;if(mobile.matches){track.setAttribute('tabindex','0');track.setAttribute('aria-label','Our expertise. Swipe or use arrow keys to explore five services.');track.setAttribute('aria-roledescription','carousel');}else{track.removeAttribute('tabindex');track.removeAttribute('aria-label');track.removeAttribute('aria-roledescription');track.scrollLeft=0;}sync();};
mobile.addEventListener('change',layout);addEventListener('resize',layout);layout();
})();
