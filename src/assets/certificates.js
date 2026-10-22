(()=>{
const dialog=document.querySelector('.certificate-dialog'),preview=document.querySelector('.certificate-hover');
if(!dialog||!preview)return;
const triggers=[...document.querySelectorAll('.certificate-trigger')];
const previous=dialog.querySelector('.certificate-previous'),next=dialog.querySelector('.certificate-next'),counter=dialog.querySelector('.certificate-counter');
let current=0;
const populate=trigger=>{for(const img of [preview.querySelector('img'),dialog.querySelector('img')]){img.src=trigger.dataset.image;img.alt=trigger.dataset.certificate;}preview.querySelector('span').textContent=trigger.dataset.certificate;dialog.querySelector('h2').textContent=trigger.dataset.certificate;dialog.querySelector('#certificate-dialog-note').textContent=trigger.dataset.description;};
const select=index=>{current=Math.max(0,Math.min(triggers.length-1,index));populate(triggers[current]);counter.textContent=(current+1)+' of '+triggers.length;previous.setAttribute('aria-disabled',String(current===0));next.setAttribute('aria-disabled',String(current===triggers.length-1));};
previous.addEventListener('click',()=>select(current-1));
next.addEventListener('click',()=>select(current+1));
dialog.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();select(current+(event.key==='ArrowRight'?1:-1));}});
const hide=()=>{preview.hidden=true;};
const show=trigger=>{
 if(!matchMedia('(hover: hover) and (pointer: fine)').matches||dialog.open)return;
 populate(trigger);preview.hidden=false;const box=trigger.getBoundingClientRect(),w=preview.offsetWidth,h=preview.offsetHeight;
 let left=box.right+16,top=box.top+(box.height-h)/2;
 if(left+w>innerWidth-12)left=box.left-w-16;
 preview.style.left=Math.max(12,Math.min(innerWidth-w-12,left))+'px';
 preview.style.top=Math.max(12,Math.min(innerHeight-h-12,top))+'px';
};
for(const trigger of document.querySelectorAll('.certificate-trigger')){
 trigger.addEventListener('pointerenter',()=>show(trigger));trigger.addEventListener('pointerleave',hide);
 trigger.addEventListener('focus',()=>show(trigger));trigger.addEventListener('blur',hide);
 trigger.addEventListener('click',()=>{hide();select(triggers.indexOf(trigger));dialog.showModal();document.documentElement.classList.add('certificate-viewer-open');});
}
dialog.querySelector('.certificate-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.documentElement.classList.remove('certificate-viewer-open');hide();});
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
addEventListener('scroll',hide,true);addEventListener('resize',hide);
})();

(()=>{const toggle=document.querySelector('.certificates-toggle'),extra=document.querySelector('.certificate-extra');if(!toggle||!extra)return;toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';extra.hidden=expanded;toggle.setAttribute('aria-expanded',String(!expanded));toggle.textContent=expanded?'View all 7 certificates ↓':'Show fewer certificates ↑';if(expanded)toggle.scrollIntoView({block:'nearest',behavior:'instant'});});})();