// Firebase Phone Authentication. Configure firebase-config.js with your own Firebase web app settings.
import { configured as ready, firebaseAuth } from './firebase-client.js';
const msg=document.getElementById('login-message');
const t=(hi,en)=>localStorage.getItem('myworld-lang')==='en'?en:hi;
const send=document.getElementById('send-otp');
const verify=document.getElementById('verify-otp');
const otpStep=document.getElementById('otp-step');
const phone=document.getElementById('phone-number');
const dialog=document.getElementById('login-dialog');
document.getElementById('close-login').onclick=()=>dialog.close();
let auth, verifier, confirmation;
if(!ready){msg.textContent=t('OTP सेवा अभी सेटअप हो रही है। Firebase कॉन्फ़िगरेशन जुड़ने के बाद SMS भेजा जा सकेगा।','OTP login is being configured. SMS will work after Firebase setup is complete.');send.disabled=true;}
else{
  try{
    const { auth: phoneAuth, sdk } = await firebaseAuth();
    const { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } = sdk;
    auth = phoneAuth;
    auth.languageCode='hi';
    onAuthStateChanged(auth,user=>{window.myWorldUser=user||null;document.getElementById('profile').textContent=user?'✓':'R';if(user){msg.textContent=t('लॉगिन सफल! ','Login successful! ')+user.phoneNumber;dialog.close();}});
    window.myWorldLogout=()=>signOut(auth);
    document.getElementById('login-form').addEventListener('submit',async e=>{
      e.preventDefault();const number=phone.value.trim();
      if(!/^[6-9][0-9]{9}$/.test(number)){msg.textContent=t('सही 10 अंकों का भारतीय मोबाइल नंबर डालें।','Enter a valid 10-digit Indian mobile number.');return}
      send.disabled=true;msg.textContent=t('OTP भेजा जा रहा है...','Sending OTP...');
      try{
        auth.languageCode=localStorage.getItem('myworld-lang')==='en'?'en':'hi';
        if(!verifier){verifier=new RecaptchaVerifier(auth,'recaptcha-container',{size:'normal'});await verifier.render()}
        confirmation=await signInWithPhoneNumber(auth,'+91'+number,verifier);
        otpStep.hidden=false;document.getElementById('otp-code').focus();msg.textContent=t('OTP भेज दिया गया है। SMS में मिला 6 अंकों का कोड डालें।','OTP sent. Enter the 6-digit code from your SMS.');
      }catch(error){verifier?.clear();verifier=null;msg.textContent=t('OTP नहीं भेजा जा सका: ','Could not send OTP: ')+(error.code||'कृपया दोबारा प्रयास करें');send.disabled=false;}
    });
    document.getElementById('otp-code').addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        verify.click();
      }
    });
    verify.onclick=async()=>{
      const code=document.getElementById('otp-code').value.trim();
      if(!confirmation||!/^[0-9]{6}$/.test(code)){msg.textContent=t('सही 6 अंकों का OTP डालें।','Enter a valid 6-digit OTP.');return}
      verify.disabled=true;msg.textContent=t('OTP वेरिफाई हो रहा है...','Verifying OTP...');
      try{await confirmation.confirm(code);confirmation=null;verifier?.clear();verifier=null;otpStep.hidden=true;send.disabled=false;document.getElementById('otp-code').value='';msg.textContent=t('लॉगिन सफल!','Login successful!');dialog.close()}
      catch(error){msg.textContent=t('OTP वेरिफाई नहीं हुआ: ','OTP verification failed: ')+(error.code||'दोबारा प्रयास करें')}
      finally{verify.disabled=false}
    };
  }catch(error){msg.textContent=t('लॉगिन सेवा लोड नहीं हुई। इंटरनेट कनेक्शन जाँचें।','Could not load login service. Check your internet connection.');send.disabled=true;}
}

window.addEventListener('myworld-language-change',()=>{if(!ready)msg.textContent=t('OTP सेवा अभी सेटअप हो रही है। Firebase कॉन्फ़िगरेशन जुड़ने के बाद SMS भेजा जा सकेगा।','OTP login is being configured. SMS will work after Firebase setup is complete.')});
