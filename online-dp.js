import {firebaseConfig} from './firebase-config.js';
import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,setDoc,deleteDoc,onSnapshot} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
const app=getApps()[0]||initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const $=id=>document.getElementById(id);let user=null,stop=null,busy=false;
function status(t){$('dpStatus').textContent=t}
function show(s){const im=$('onlineAvatar');if(typeof s==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(s)&&s.length<=40000){im.src=s;im.hidden=false}else{im.removeAttribute('src');im.hidden=true}}
function buttons(){ $('dpSave').disabled=$('dpRemove').disabled=!user||busy }
onAuthStateChanged(auth,u=>{if(stop)stop();stop=null;user=u?.emailVerified?u:null;show(null);buttons();if(!user){status('Online DP के लिए verified email से login करें।');return}status('Online DP loading…');stop=onSnapshot(doc(db,'mwProfiles',user.uid),s=>{show(s.data()?.photo);status(s.metadata.fromCache?'Offline preview':s.exists()?'Online DP saved':'Online DP नहीं लगी है।')},()=>status('Online DP unavailable — Firebase rules check करें।'))});
async function compress(f){if(!f||!f.type.startsWith('image/')||f.size>15000000)throw Error('15 MB से छोटी फोटो चुनें।');const url=URL.createObjectURL(f);try{const im=new Image();im.src=url;await im.decode();const c=document.createElement('canvas');c.width=c.height=160;const g=c.getContext('2d'),n=Math.min(im.width,im.height);g.fillStyle='white';g.fillRect(0,0,160,160);g.drawImage(im,(im.width-n)/2,(im.height-n)/2,n,n,0,0,160,160);for(const q of [.8,.6,.4,.2]){const s=c.toDataURL('image/jpeg',q);if(s.length<=40000)return s}throw Error('फोटो बहुत बड़ी है।')}finally{URL.revokeObjectURL(url)}}
$('dpSave').onclick=async()=>{const u=user;if(!u||busy)return;busy=true;buttons();try{const photo=await compress($('dpFile').files[0]);if(user!==u)return;await setDoc(doc(db,'mwProfiles',u.uid),{photo});if(user===u){$('dpFile').value='';status('Online DP saved')}}catch(e){status('DP save failed: '+e.message)}finally{busy=false;buttons()}};
$('dpRemove').onclick=async()=>{const u=user;if(!u||busy)return;busy=true;buttons();try{await deleteDoc(doc(db,'mwProfiles',u.uid));if(user===u)status('Online DP removed')}catch(e){status('DP remove failed: '+e.message)}finally{busy=false;buttons()}};
