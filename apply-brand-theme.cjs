const fs=require('fs');
const file='src/index.html';let html=fs.readFileSync(file,'utf8');
const palette={
'#183b35':'#171d46','#1e493c':'#171d46','#52685f':'#596076','#53665a':'#343b60',
'#59736a':'#626985','#66815c':'#947122','#71855d':'#947122','#7b9069':'#ad8838',
'#7b9166':'#947122','#887031':'#b18b35','#b3c995':'#d7c69e','#b9c8a7':'#d2c4a2',
'#c9d3c1':'#dcd5c7','#d4ded4':'#e4e5ee','#d9dfd3':'#dedbd3','#d9ecb1':'#dfbf69',
'#e1e7d8':'#eae4d6','#e2e8d8':'#ece5d5','#edf0e5':'#f0ece3','#f7f6eff5':'#faf8f3f5','#f7f6ef':'#faf8f3'};
for(const key of Object.keys(palette).sort((a,b)=>b.length-a.length))html=html.split(key).join(palette[key]);
html=html.replace('</style>',`header{background:#171d46;border-bottom:1px solid #41486d}.links a{color:#faf8f3}.links .button{background:#dfbf69;color:#171d46;border-color:#dfbf69}.brand-logo{width:225px;height:64px;object-fit:contain}.about .button{background:#dfbf69}.portrait figcaption,.portrait-role,.portrait-qualifications{color:#e4e5ee}.portrait-name{color:#faf8f3}.about .credentials{border-color:#626985}.art{background:#ece5d5}.hero h1 em{color:#947122}.visit{background:#eee4ce}.visit .fine,.visit .pending-detail{color:#596076}.service-page-link{color:#171d46}.treatment-number{color:#947122}@media(max-width:800px){.brand-logo{width:175px;height:54px}}@media(max-width:360px){.brand-logo{width:145px;height:48px}} </style>`);
fs.writeFileSync(file,html);
// Crop the displayed canvas without altering or regenerating the supplied raster artwork.
const image=fs.readFileSync('src/assets/nova-logo-source.jpg').toString('base64');
fs.writeFileSync('src/assets/nova-logo.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="190 215 780 390" role="img" aria-labelledby="title"><title id="title">Nova Movement Atelier — Crafting a pain free future</title><image width="1280" height="814" href="data:image/jpeg;base64,${image}"/></svg>`);
// Use the original movement emblem for the browser icon, retaining the supplied artwork.
fs.writeFileSync('src/assets/nova-icon.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="365 215 270 270"><image width="1280" height="814" href="data:image/jpeg;base64,${image}"/></svg>`);
console.log('Navy, gold and ivory theme applied; supplied logo and emblem retained without AI alteration.');
