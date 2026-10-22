(()=>{
const dialog=document.querySelector('.certificate-dialog'),preview=document.querySelector('.certificate-hover');
if(!dialog||!preview)return;
const populate=trigger=>{for(const img of [preview.querySelector('img'),dialog.querySelector('img')]){img.src=trigger.dataset.image;img.alt=trigger.dataset.certificate;}preview.querySelector('span').textContent=trigger.dataset.certificate;dialog.querySelector('h2').textContent=trigger.dataset.certificate;dialog.querySelector('#certificate-dialog-note').textContent=trigger.dataset.description;};
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
 trigger.addEventListener('click',()=>{hide();populate(trigger);dialog.showModal();document.documentElement.classList.add('certificate-viewer-open');});
}
dialog.querySelector('.certificate-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.documentElement.classList.remove('certificate-viewer-open');hide();});
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
addEventListener('scroll',hide,true);addEventListener('resize',hide);
})();

(()=>{const toggle=document.querySelector('.certificates-toggle'),extra=document.querySelector('.certificate-extra');if(!toggle||!extra)return;toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';extra.hidden=expanded;toggle.setAttribute('aria-expanded',String(!expanded));toggle.textContent=expanded?'View all 7 certificates ↓':'Show fewer certificates ↑';if(expanded)toggle.scrollIntoView({block:'nearest',behavior:'instant'});});})();