const fs=require('fs'),cp=require('child_process');
const settings=JSON.parse(fs.readFileSync('site-settings.json','utf8'));
const flag=(name,fallback)=>{const value=process.env[name];if(value===undefined)return fallback;if(!['true','false'].includes(value))throw Error(name+' must be true or false');return value==='true';};
const {origin,indexing,production}=require('./seo-config.cjs').indexingPolicy();
const enabled=flag('SERVICE_PAGES_ENABLED',settings.servicePagesEnabled);
const feesEnabled=flag('APPOINTMENTS_FEES_ENABLED',settings.appointmentsFeesEnabled??false);
const certificatesEnabled=flag('CERTIFICATES_ENABLED',settings.certificatesEnabled??false);
// Start from maintained sources so disabled service routes cannot survive a previous build.
fs.mkdirSync('dist',{recursive:true});
fs.cpSync('src','dist',{recursive:true});
let homepage=fs.readFileSync('dist/index.html','utf8');
homepage=homepage.replace('<!-- certificates-section -->',certificatesEnabled?require('./render-certificates.cjs')():'');
homepage=homepage.replace('<!-- appointments-fees-section -->',feesEnabled?fs.readFileSync('templates/appointments-fees.html','utf8'):'');
if(feesEnabled)homepage=homepage.replace('href="#first-visit">First visit</a>','href="#first-visit">First visit &amp; fees</a>');
fs.writeFileSync('dist/index.html',homepage);
fs.writeFileSync('site-settings.json',JSON.stringify({...settings,servicePagesEnabled:enabled,siteUrl:origin},null,2)+'\n');
try{cp.execFileSync(process.execPath,['build-seo.cjs'],{stdio:'inherit'});}finally{fs.writeFileSync('site-settings.json',JSON.stringify(settings,null,2)+'\n');}
const htmlPages=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()&&x.name!=='assets'?htmlPages(dir+'/'+x.name):x.isFile()&&x.name.endsWith('.html')?[dir+'/'+x.name]:[]);
const pages=htmlPages('dist');
// Only the explicit public routes in the sitemap may have restrictions removed.
// Other HTML (including future private/review pages) retains its own directives.
const publicPages=new Set([...fs.readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>'dist'+(new URL(m[1]).pathname==='/'?'/index.html':new URL(m[1]).pathname+'index.html')));
for(const page of pages){let html=fs.readFileSync(page,'utf8');if(publicPages.has(page))html=html.replace(/<meta\b[^>]*>/gi,tag=>/\bname\s*=\s*["'](?:robots|googlebot|googlebot-news)["']/i.test(tag)?'':tag);if(!indexing||!publicPages.has(page))html=html.replace('</head>','<meta name="robots" content="noindex, nofollow"></head>');if(production&&publicPages.has(page))html=html.replace('</head>','<script src="/assets/analytics.js" defer></script></head>');fs.writeFileSync(page,html);}
const privateHeaders=pages.filter(p=>!publicPages.has(p)).map(p=>'\n'+p.slice(4).replace(/index\.html$/,'')+'\n  X-Robots-Tag: noindex, nofollow\n').join('');
fs.writeFileSync('dist/_headers',`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n${indexing?'':'  X-Robots-Tag: noindex, nofollow\n'}${privateHeaders}`);
console.log(`Netlify output ready. Indexing ${indexing?'ON':'OFF'}; service pages ${enabled?'ON':'OFF'}; appointments & fees ${feesEnabled?'ON':'OFF'}.`);
