const fs=require('fs'),cp=require('child_process');
const settings=JSON.parse(fs.readFileSync('site-settings.json','utf8'));
const flag=(name,fallback)=>{const value=process.env[name];if(value===undefined)return fallback;if(!['true','false'].includes(value))throw Error(name+' must be true or false');return value==='true';};
const indexing=flag('INDEXING_ENABLED',false);
const enabled=flag('SERVICE_PAGES_ENABLED',settings.servicePagesEnabled);
const feesEnabled=flag('APPOINTMENTS_FEES_ENABLED',settings.appointmentsFeesEnabled??false);
const certificatesEnabled=flag('CERTIFICATES_ENABLED',settings.certificatesEnabled??false);
const origin=process.env.SITE_URL||process.env.DEPLOY_PRIME_URL||process.env.URL||settings.siteUrl;
// Start from maintained sources so disabled service routes cannot survive a previous build.
fs.mkdirSync('dist',{recursive:true});
fs.cpSync('src','dist',{recursive:true});
let homepage=fs.readFileSync('dist/index.html','utf8');
homepage=homepage.replace('<!-- certificates-section -->',certificatesEnabled?fs.readFileSync('templates/certificates.html','utf8'):'');
homepage=homepage.replace('<!-- appointments-fees-section -->',feesEnabled?fs.readFileSync('templates/appointments-fees.html','utf8'):'');
if(feesEnabled)homepage=homepage.replace('href="#first-visit">First visit</a>','href="#first-visit">First visit &amp; fees</a>');
fs.writeFileSync('dist/index.html',homepage);
fs.writeFileSync('site-settings.json',JSON.stringify({...settings,servicePagesEnabled:enabled,siteUrl:origin},null,2)+'\n');
try{cp.execFileSync(process.execPath,['build-seo.cjs'],{stdio:'inherit'});}finally{fs.writeFileSync('site-settings.json',JSON.stringify(settings,null,2)+'\n');}
const pages=['dist/index.html',...fs.readdirSync('dist',{withFileTypes:true}).filter(x=>x.isDirectory()&&x.name!=='assets').map(x=>'dist/'+x.name+'/index.html').filter(x=>fs.existsSync(x))];
for(const page of pages){let html=fs.readFileSync(page,'utf8');html=html.replace(/<meta name="robots"[^>]*>/g,'');if(!indexing)html=html.replace('</head>','<meta name="robots" content="noindex, nofollow"></head>');fs.writeFileSync(page,html);}
fs.writeFileSync('dist/_headers',`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n${indexing?'':'  X-Robots-Tag: noindex, nofollow\n'}`);
console.log(`Netlify output ready. Indexing ${indexing?'ON':'OFF'}; service pages ${enabled?'ON':'OFF'}; appointments & fees ${feesEnabled?'ON':'OFF'}.`);
