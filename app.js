const productsData=[
{id:1,hi:'MYPODS CORE NB6',en:'MYPODS CORE NB6',price:980,mrp:1999,cat:'audio',tag:'50% OFF'},
{id:2,hi:'मोबाइल टेबल यूनिवर्सल स्टैंड',en:'Professional Mobile Table Universal Stand',price:599,mrp:999,cat:'charging',tag:'40% OFF'},
{id:3,hi:'COOLPODS BT',en:'COOLPODS BT',price:499,mrp:999,cat:'audio',tag:'50% OFF'},
{id:4,hi:'EVM 10000mAh मेगासेफ पावर बैंक',en:'EVM 10000mAh Megasafe Powerbank',price:1649,mrp:3999,cat:'power',tag:'58% OFF'}
];
let lang=localStorage.getItem('myworld-lang')==='en'?'en':'hi',cat='all';const $=id=>document.getElementById(id);
function render(){const q=$('search').value.trim().toLowerCase();const rows=productsData.filter(p=>(cat==='all'||p.cat===cat)&&(p[lang].toLowerCase().includes(q)||p.en.toLowerCase().includes(q))); $('products').innerHTML=rows.map(p=>`<article class="product"><div class="art"><span class="tag">${p.tag}</span><span class="photo-pending">Rajeshwar Digital Sales</span></div><div class="pinfo"><b>${p[lang]}</b><small><s>₹${p.mrp.toLocaleString('en-IN')}</s> • Rajeshwar Digital Sales</small><div class="pfoot"><span class="price">₹${p.price.toLocaleString('en-IN')}</span><a class="add" href="https://rajeshwardigitalsales.smartbiz.in/best-sellers" target="_blank" rel="noopener noreferrer">${lang==='hi'?'खरीदें ↗':'Buy ↗'}</a></div></div></article>`).join('')||(lang==='hi'?'<p>कोई प्रोडक्ट नहीं मिला</p>':'<p>No products found</p>')}
function pop(title,body){$('mt').textContent=title;$('mb').textContent=body;$('modal').showModal()}
const services={
hi:{privatechat:['Customer Private Chat — Coming Soon','यह सुविधा जल्द उपलब्ध होगी।'],recharge:['मोबाइल रिचार्ज — जल्द आ रहा है','यह सुविधा अधिकृत रिचार्ज पार्टनर जुड़ने के बाद उपलब्ध होगी।'],dth:['DTH और बिल — जल्द आ रहा है','यह सुविधा अभी निर्माणाधीन है।'],finance:['फाइनेंस — जल्द आ रहा है','वित्तीय सेवाएँ अधिकृत पार्टनर के माध्यम से शुरू होंगी।'],retailer:['रिटेलर पार्टनर — जल्द आ रहा है','रिटेलर रजिस्ट्रेशन और KYC सुविधा जल्द शुरू होगी।']},
en:{privatechat:['Customer Private Chat — Coming Soon','This feature is coming soon.'],recharge:['Mobile Recharge — Coming Soon','This service will be available after an authorized recharge partner is connected.'],dth:['DTH & Bills — Coming Soon','This service is under development.'],finance:['Finance — Coming Soon','Financial services will be offered through authorized partners.'],retailer:['Retailer Partner — Coming Soon','Retailer registration and KYC will be available soon.']}
};
document.querySelector('.services').addEventListener('click',e=>{const b=e.target.closest('[data-service]');if(b){if(b.dataset.service==='support'){$('help').scrollIntoView({behavior:'smooth'});return}if(b.dataset.service==='repair'){$('repair-dialog').showModal();return}const x=services[lang][b.dataset.service];pop(x[0],x[1])}});
$('search').addEventListener('input',render);document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-cat]').forEach(x=>x.classList.remove('chosen'));b.classList.add('chosen');cat=b.dataset.cat;render()});
$('explore').onclick=()=>$('services').scrollIntoView({behavior:'smooth'});$('all').onclick=()=>{cat='all';document.querySelectorAll('[data-cat]').forEach(x=>x.classList.toggle('chosen',x.dataset.cat==='all'));$('search').value='';render()};
$('profile').onclick=()=>$('login-dialog').showModal();
document.querySelector('.partner button').onclick=()=>pop(...services[lang].retailer);
document.querySelector('.bottom').addEventListener('click',e=>{const b=e.target.closest('[data-nav]');if(!b)return;document.querySelectorAll('.bottom button').forEach(x=>x.classList.remove('active'));b.classList.add('active');if(b.dataset.nav==='home')scrollTo({top:0,behavior:'smooth'});else if(b.dataset.nav==='shop')$('shop').scrollIntoView({behavior:'smooth'});else if(b.dataset.nav==='account')$('login-dialog').showModal();else window.open('https://rajeshwardigitalsales.smartbiz.in/','_blank','noopener,noreferrer')});

// Full bilingual interface. Translation affects visible copy, not phone numbers, prices or external URLs.
const translations={
'header .brand small':['Founded by Mr. Rahul Kumawat','Founded by Mr. Rahul Kumawat'],
'.hero label':['✦ आपका डिजिटल संसार','✦ YOUR DIGITAL WORLD'],
'.hero p':['रिचार्ज, शॉपिंग और रोज़मर्रा की डिजिटल सेवाएँ — एक ही जगह।','Recharge, shopping and everyday digital services — all in one place.'],
'#explore':['सेवाएँ देखें ↗','Explore services ↗'],
'.stats>div:nth-child(1) b':['तेज़ सेवाएँ','Quick access'],
'.stats>div:nth-child(1) small':['आसान एक्सेस','Easy to use'],
'.stats>div:nth-child(2) b':['सुरक्षित अनुभव','Secure experience'],
'.stats>div:nth-child(2) small':['विश्वसनीय प्लेटफॉर्म','Trusted platform'],
'.stats>div:nth-child(3) b':['एक ही प्लेटफॉर्म','One platform'],
'.stats>div:nth-child(3) small':['कई सुविधाएँ','Many services'],
'#services .heading label':['आपके लिए','MADE FOR YOU'],
'#services .heading h2':['हमारी सर्विसेज़','Our Services'],
'#services .heading>small':['अपनी जरूरत चुनें','Choose a service'],
'[data-service="recharge"] b':['मोबाइल रिचार्ज','Mobile Recharge'],
'[data-service="recharge"] small':['प्रीपेड / पोस्टपेड','Prepaid / Postpaid'],
'[data-service="dth"] b':['DTH और बिल','DTH & Bills'],
'[data-service="dth"] small':['टीवी और यूटिलिटी','TV & Utilities'],
'[data-service="finance"] b':['फाइनेंस','Finance'],
'[data-service="finance"] small':['वित्तीय सेवाएँ','Financial Services'],
'[data-service="retailer"] b':['रिटेलर बनें','Become a Retailer'],
'[data-service="retailer"] small':['बिज़नेस पार्टनर','Business Partner'],
'[data-service="repair"] b':['मोबाइल रिपेयरिंग','Mobile Repairing'],
'[data-service="repair"] small':['रिपेयरिंग रिक्वेस्ट भेजें','Send repair request'],
'[data-service="support"] b':['हेल्प सेंटर','Help Center'],
'[data-service="support"] small':['कॉल और ईमेल सपोर्ट','Call & Email Support'],
'#shop .heading label':['राजेश्वर डिजिटल सेल्स से खरीदें','SHOP FROM RAJESHWAR DIGITAL SALES'],
'#shop .heading h2':['चुनिंदा प्रोडक्ट्स','Featured Products'],
'#all':['सभी देखें ↗','View all ↗'],
'[data-cat="all"]':['सभी','All'],
'[data-cat="audio"]':['ऑडियो','Audio'],
'[data-cat="charging"]':['चार्जिंग','Charging'],
'[data-cat="power"]':['पावर','Power'],
'.shop-note':['प्रोडक्ट की उपलब्धता और अंतिम कीमत वेबसाइट पर जाँचें। खरीदारी के लिए {SHOP} पर जाएँ।','Check availability and final prices on the website. Shop at {SHOP}.'],
'#help .heading label':['हम आपकी सहायता के लिए हैं','WE ARE HERE TO HELP'],
'#help .heading h2':['सहायता और संपर्क','Help & Support'],
'.help-card>p':['किसी भी सहायता या जानकारी के लिए हमसे संपर्क करें।','Contact us for help or information.'],
'.contact-row:nth-of-type(1) b':['कॉल सपोर्ट','Call Support'],
'.contact-row:nth-of-type(2) b':['व्हाट्सऐप चैट','WhatsApp Chat'],
'.contact-row:nth-of-type(2) small':['सीधे WhatsApp पर सहायता लें','Chat with us on WhatsApp'],
'.contact-row:nth-of-type(3) b':['ईमेल सपोर्ट','Email Support'],
'.contact-row:nth-of-type(4) b':['दूसरा ईमेल','Alternate Email'],
'.partner label':['MY WORLD के साथ आगे बढ़ें','GROW WITH MY WORLD'],
'.partner h2':['हमारे रिटेलर पार्टनर बनें','Become a Retail Partner'],
'.partner p':['रिटेलर सुविधा जल्द शुरू होगी।','Retailer services are coming soon.'],
'#about .heading label':['संस्थापक के बारे में','ABOUT THE FOUNDER'],
'#about .heading h2':['हमारे बारे में','About Us'],
'.founder-tag':['संस्थापक','FOUNDER'],
'.about-copy>p:first-of-type':['राजेश्वर मोबाइल पिछले पाँच वर्षों से ई-कॉमर्स क्षेत्र में सक्रिय है और निकट भविष्य में अपना प्लेटफॉर्म शुरू करने का लक्ष्य रखता है। श्री राहुल कुमावत के नेतृत्व में कंपनी ऑफलाइन, ऑनलाइन और गेमिंग—तीन क्षेत्रों में काम करती है।','Rajeshwar Mobile has been active in the e-commerce sector for the past five years and aims to launch its own platform in the near future. The company operates across three categories—offline, online, and gaming platforms—under the strategic leadership of Mr. Rahul Kumawat.'],
'.note':['नोट: MY WORLD पर शॉपिंग के लिए Rajeshwar Digital Sales की लाइव वेबसाइट खुलती है। रिचार्ज, बिल भुगतान, फाइनेंस और अन्य सेवाएँ अधिकृत पार्टनर और सुरक्षित सिस्टम जुड़ने के बाद शुरू होंगी।','Note: Shopping opens the live Rajeshwar Digital Sales website. Recharge, bill payment, finance and other services will launch after authorized partners and secure systems are connected.'],
'[data-nav="home"] small':['होम','Home'],
'[data-nav="shop"] small':['शॉपिंग','Shopping'],
'[data-nav="orders"] small':['ऑर्डर','Orders'],
'[data-nav="account"] small':['अकाउंट','Account'],
'#modal .ok':['समझ गया','Got it']
};
function setLanguage(next){
lang=next;localStorage.setItem('myworld-lang',next);document.documentElement.lang=next;
$('lang').textContent=next==='hi'?'हिंदी / EN':'English / HI';
$('install').textContent=next==='hi'?'इंस्टॉल करें':'Install';
document.querySelector('.hero h1').innerHTML=next==='hi'?'सब कुछ अब<br><em>MY WORLD</em> में':'Everything in<br><em>MY WORLD</em>';
for(const [selector,values] of Object.entries(translations)){
const el=document.querySelector(selector);if(!el)continue;
const value=values[next==='hi'?0:1];
if(selector==='.shop-note'){el.innerHTML=value.replace('{SHOP}','<a href="https://rajeshwardigitalsales.smartbiz.in/" target="_blank" rel="noopener noreferrer">Rajeshwar Digital Sales</a>')}
else el.textContent=value;
}
document.querySelectorAll('.soon').forEach(el=>el.textContent=next==='hi'?'जल्द आ रहा है':'COMING SOON');
document.querySelector('.partner button').textContent=next==='hi'?'जल्द आ रहा है':'COMING SOON';
$('search').placeholder=next==='hi'?'प्रोडक्ट खोजें...':'Search products...';
translateRepair();
render();window.dispatchEvent(new CustomEvent('myworld-language-change',{detail:{lang:next}}));
}
$('lang').onclick=()=>setLanguage(lang==='hi'?'en':'hi');
const repairTexts={
hi:{title:'मोबाइल रिपेयरिंग सर्विस',intro:'अपनी जानकारी भरें। रिक्वेस्ट WhatsApp पर भेजी जाएगी।',name:'ग्राहक का नाम *',phone:'मोबाइल नंबर *',address:'पूरा पता *',model:'मोबाइल कंपनी / मॉडल',problem:'मोबाइल में क्या समस्या है? *',consent:'मैं अपनी दी गई जानकारी रिपेयरिंग सहायता के लिए WhatsApp पर भेजने की सहमति देता/देती हूँ।',note:'आपकी जानकारी इस वेबसाइट पर सेव नहीं होगी। WhatsApp खुलने के बाद Send दबाना होगा।',submit:'WhatsApp पर रिक्वेस्ट भेजें ↗',phonePlaceholder:'10 अंकों का नंबर',modelPlaceholder:'जैसे Samsung A15'},
en:{title:'Mobile Repairing Service',intro:'Enter your details to prepare a repair request for WhatsApp.',name:'Customer name *',phone:'Mobile number *',address:'Full address *',model:'Phone brand / model',problem:'Describe the phone problem *',consent:'I agree to share the information I entered through WhatsApp for repair support.',note:'This website does not save your details. You must tap Send after WhatsApp opens.',submit:'Send request on WhatsApp ↗',phonePlaceholder:'10-digit number',modelPlaceholder:'e.g. Samsung A15'}
};
function translateRepair(){
const t=repairTexts[lang];
for(const [key,id] of Object.entries({title:'repair-title',intro:'repair-intro',name:'repair-name-label',phone:'repair-phone-label',address:'repair-address-label',model:'repair-model-label',problem:'repair-problem-label',consent:'repair-consent-label',note:'repair-note',submit:'repair-submit'}))$(id).textContent=t[key];
$('repair-phone').placeholder=t.phonePlaceholder;$('repair-model').placeholder=t.modelPlaceholder;
}
setLanguage(lang);
$('close-repair').onclick=()=>$('repair-dialog').close();
$('repair-form').addEventListener('submit',e=>{
e.preventDefault();
const form=e.currentTarget;if(!form.reportValidity())return;
const name=$('repair-name').value.trim(),phone=$('repair-phone').value.trim(),address=$('repair-address').value.trim(),model=$('repair-model').value.trim(),problem=$('repair-problem').value.trim();
if(!name||!/^[6-9][0-9]{9}$/.test(phone)||!address||!problem||!$('repair-consent').checked)return;
const message=['MY WORLD - Mobile Repair Request','Customer Name: '+name,'Mobile Number: '+phone,'Address: '+address,'Phone Model: '+(model||'Not specified'),'Problem: '+problem].join('\n');
const url='https://wa.me/917572805685?text='+encodeURIComponent(message);
const opened=window.open(url,'_blank','noopener,noreferrer');
if(!opened)window.location.href=url;
});

if('serviceWorker'in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
let installPrompt=null;window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});$('install').addEventListener('click',async()=>{if(installPrompt){const prompt=installPrompt;installPrompt=null;await prompt.prompt();return}pop(lang==='hi'?'MY WORLD इंस्टॉल करें':'Install MY WORLD',lang==='hi'?'Android Chrome में मेनू (⋮) खोलकर Add to Home screen या Install app चुनें। iPhone Safari में Share → Add to Home Screen चुनें।':'In Android Chrome, open the menu (⋮) and choose Add to Home screen or Install app. On iPhone Safari, choose Share → Add to Home Screen.')});window.addEventListener('appinstalled',()=>{$('install').hidden=true});

// Informational RCoin value calculator. No wallet balance or issuance is simulated.
const rcoinInput=document.getElementById('rcoin-input');
if(rcoinInput){const updateRCoin=()=>{const raw=Number(rcoinInput.value);const count=Number.isFinite(raw)?Math.max(0,Math.floor(raw)):0;document.getElementById('rcoin-value').textContent='₹'+(count*0.015).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})};rcoinInput.addEventListener('input',updateRCoin);updateRCoin()}
