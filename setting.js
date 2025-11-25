// settings.js
import { auth } from './firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// DOM Elements
const settingsBtn = document.getElementById('settingsBtn');

settingsBtn.addEventListener('click', () => {
  if (!auth.currentUser) {
    alert('No user logged in');
    return;
  }

  const logout = confirm(`Logged in as ${auth.currentUser.phoneNumber}\nDo you want to logout?`);
  if (logout) {
    signOut(auth)
      .then(() => {
        alert('Logged out successfully');
      })
      .catch((err) => {
        console.error(err);
        alert('Error logging out: ' + err.message);
      });
  }
});