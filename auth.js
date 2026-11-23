// Firebase Phone Authentication. Configure firebase-config.js with your own Firebase web app settings.
import { firebaseConfig } from './firebase-config.js';
const msg=document.getElementById('login-message');
const send=document.getElementById('send-otp');
const verify=document.getElementById('verify-otp');
const otpStep=document.getElementById('otp-step');
const phone=document.getElementById('phone-number');
const dialog=document.getElementById('login-dialog');
document.getElementById('close-login').onclick=()=>dialog.close();
let auth, verifier, confirmation;
const ready=Boolean(firebaseConfig.apiKey&&firebaseConfig.authDomain&&firebaseConfig.projectId&&firebaseConfig.appId);
if(!ready){msg.textContent='OTP सेवा अभी सेटअप हो रही है। Firebase कॉन्फ़िगरेशन जुड़ने के बाद SMS भेजा जा सकेगा।';send.disabled=true;}
else{
  try{
    const [{initializeApp},{getAuth,RecaptchaVerifier,signInWithPhoneNumber,onAuthStateChanged,signOut}]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js')
    ]);
    auth=getAuth(initializeApp(firebaseConfig));
    auth.languageCode='hi';
    onAuthStateChanged(auth,user=>{window.myWorldUser=user||null;document.getElementById('profile').textContent=user?'✓':'R';if(user){msg.textContent='लॉगिन सफल! '+user.phoneNumber;dialog.close();}});
    window.myWorldLogout=()=>signOut(auth);
    document.getElementById('login-form').addEventListener('submit',async e=>{
      e.preventDefault();const number=phone.value.trim();
      if(!/^[6-9][0-9]{9}$/.test(number)){msg.textContent='सही 10 अंकों का भारतीय मोबाइल नंबर डालें।';return}
      send.disabled=true;msg.textContent='OTP भेजा जा रहा है...';
      try{
        if(!verifier){verifier=new RecaptchaVerifier(auth,'recaptcha-container',{size:'normal'});await verifier.render()}
        confirmation=await signInWithPhoneNumber(auth,'+91'+number,verifier);
        otpStep.hidden=false;msg.textContent='OTP भेज दिया गया है। SMS में मिला 6 अंकों का कोड डालें।';
      }catch(error){msg.textContent='OTP नहीं भेजा जा सका: '+(error.code||'कृपया दोबारा प्रयास करें');send.disabled=false;}
    });
    verify.onclick=async()=>{
      const code=document.getElementById('otp-code').value.trim();
      if(!confirmation||!/^[0-9]{6}$/.test(code)){msg.textContent='सही 6 अंकों का OTP डालें।';return}
      verify.disabled=true;msg.textContent='OTP वेरिफाई हो रहा है...';
      try{await confirmation.confirm(code);msg.textContent='लॉगिन सफल!';dialog.close()}
      catch(error){msg.textContent='OTP वेरिफाई नहीं हुआ: '+(error.code||'दोबारा प्रयास करें')}
      finally{verify.disabled=false}
    };
  }catch(error){msg.textContent='लॉगिन सेवा लोड नहीं हुई। इंटरनेट कनेक्शन जाँचें।';send.disabled=true;}
}
