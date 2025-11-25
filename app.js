// app.js
import { auth } from './firebase.js';
import { signInWithPhoneNumber, RecaptchaVerifier, confirmationResult } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// DOM Elements
const loginModal = document.getElementById('loginModal');
const uploadModal = document.getElementById('uploadModal');
const uploadBtn = document.getElementById('uploadBtn');
const settingsBtn = document.getElementById('settingsBtn');

const phoneInput = document.getElementById('phoneNumber');
const sendCodeBtn = document.getElementById('sendCodeBtn');
const codeInput = document.getElementById('verificationCode');
const verifyCodeBtn = document.getElementById('verifyCodeBtn');

let confirmationResultGlobal;

// Show modals
uploadBtn.addEventListener('click', () => {
  if (!auth.currentUser) {
    loginModal.style.display = 'flex';
  } else {
    uploadModal.style.display = 'flex';
  }
});

settingsBtn.addEventListener('click', () => {
  alert('Settings coming soon!');
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.style.display = 'none';
  if (e.target === uploadModal) uploadModal.style.display = 'none';
});

// ----- PHONE LOGIN -----
window.recaptchaVerifier = new RecaptchaVerifier('sendCodeBtn', {
  'size': 'invisible',
  'callback': (response) => {
    console.log('reCAPTCHA solved', response);
  }
}, auth);

// Send verification code
sendCodeBtn.addEventListener('click', () => {
  const phoneNumber = phoneInput.value.trim();
  if (!phoneNumber) return alert('Enter a valid phone number');

  signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
    .then((confirmationResult) => {
      confirmationResultGlobal = confirmationResult;
      alert('Code sent!');
      codeInput.style.display = 'block';
      verifyCodeBtn.style.display = 'block';
    })
    .catch((error) => {
      console.error(error);
      alert('Error sending code: ' + error.message);
    });
});

// Verify code
verifyCodeBtn.addEventListener('click', () => {
  const code = codeInput.value.trim();
  if (!code) return alert('Enter verification code');

  confirmationResultGlobal.confirm(code)
    .then((result) => {
      const user = result.user;
      alert('Login successful! Welcome ' + user.phoneNumber);
      loginModal.style.display = 'none';
      codeInput.style.display = 'none';
      verifyCodeBtn.style.display = 'none';
      phoneInput.value = '';
    })
    .catch((error) => {
      console.error(error);
      alert('Incorrect code.');
    });
});

// ----- CHECK AUTH STATE -----
auth.onAuthStateChanged(user => {
  if (user) {
    console.log('User logged in:', user.phoneNumber);
  } else {
    console.log('No user logged in');
  }
});