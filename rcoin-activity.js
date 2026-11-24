import {firebaseConfig} from './firebase-config.js';
import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
const auth=getAuth(getApps()[0]||initializeApp(firebaseConfig));
let uid=null,elapsed=0,last=performance.now(),activity=last,earned=false;
const page=location.pathname.split('/').pop()||'index.html';
const eligible=!['index.html','upcoming-services.html','rcoin-wallet.html','new-version-update.html'].includes(page);
const key=()=> 'mw-rcoin-demo-'+uid;
function balance(){try{return Math.max(0,Number(localStorage.getItem(key()))||0)}catch{return 0}}
function render(){document.querySelectorAll('[data-rcoin-balance]').forEach(e=>e.textContent=uid?String(balance()):'Login required');}
onAuthStateChanged(auth,u=>{if(uid!== (u?.uid||null)){uid=u?.uid||null;elapsed=0;earned=false;last=performance.now();activity=last;}render()});
for(const event of ['pointerdown','pointermove','keydown','touchstart','scroll'])addEventListener(event,()=>{activity=performance.now()},{passive:true});
document.addEventListener('visibilitychange',()=>{last=performance.now()});
addEventListener('storage',render);
setInterval(()=>{const now=performance.now(),delta=Math.min(1000,now-last);last=now;if(!uid||!eligible||earned||document.hidden||!document.hasFocus()||now-activity>60000)return;elapsed+=delta;if(elapsed<=45000)return;earned=true;try{localStorage.setItem(key(),String(balance()+1));render();const n=document.createElement('div');n.textContent='+1 RCoin · Activity reward (demo)';n.setAttribute('role','status');Object.assign(n.style,{position:'fixed',bottom:'85px',left:'50%',transform:'translateX(-50%)',background:'#183775',color:'white',padding:'12px 18px',borderRadius:'14px',zIndex:'99999',font:'bold 14px system-ui',maxWidth:'90vw'});document.body.append(n);setTimeout(()=>n.remove(),4000)}catch{}},500);

const shareButton=document.getElementById('rcoin-share'),shareStatus=document.getElementById('rcoin-share-status');
let sharing=false;
function shareState(){if(!shareButton)return;let claimed=false;try{claimed=!!uid&&localStorage.getItem('mw-rcoin-share-'+uid)==='1'}catch{}shareButton.disabled=!uid||claimed||sharing||!navigator.share;shareStatus.textContent=!uid?'Login required':claimed?'150 RCoin already claimed on this browser.':!navigator.share?'Native sharing unavailable in this browser.':'Share MY WORLD to claim 150 demo RCoin.'}
onAuthStateChanged(auth,()=>shareState());addEventListener('storage',shareState);
if(shareButton)shareButton.onclick=async()=>{if(!uid||sharing||!navigator.share)return;const account=uid,claim='mw-rcoin-share-'+account;try{if(localStorage.getItem(claim)==='1')return;sharing=true;shareState();await navigator.share({title:'MY WORLD',text:'Explore MY WORLD – your digital world!',url:'https://rahulrajeshwari.github.io/MY-WORLD/'});if(uid!==account)return;if(localStorage.getItem(claim)==='1')return;localStorage.setItem(claim,'1');localStorage.setItem(key(),String(balance()+150));render();}catch(e){if(e.name!=='AbortError')shareStatus.textContent='Share failed. Please try again.'}finally{sharing=false;shareState()}};
