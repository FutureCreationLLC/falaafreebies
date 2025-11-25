// upload.js
import { auth, db, storage } from './firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// DOM Elements
const uploadModal = document.getElementById('uploadModal');
const imageFile = document.getElementById('imageFile');
const itemTitle = document.getElementById('itemTitle');
const itemCategory = document.getElementById('itemCategory');
const uploadItemBtn = document.getElementById('uploadItemBtn');

// Get user country (fallback client-side)
async function getUserCountry() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return data.country_name || 'Unknown';
  } catch (err) {
    console.warn('GeoIP failed:', err);
    return 'Unknown';
  }
}

// Upload item
uploadItemBtn.addEventListener('click', async () => {
  const file = imageFile.files[0];
  const title = itemTitle.value.trim();
  const category = itemCategory.value;

  if (!file) return alert('Select an image');
  if (!title) return alert('Enter a title');
  if (!auth.currentUser) return alert('You must be logged in');

  const country = await getUserCountry();

  const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed', 
    (snapshot) => {
      // Optional: progress bar can be added here
    }, 
    (error) => {
      console.error(error);
      alert('Upload failed: ' + error.message);
    }, 
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      try {
        await addDoc(collection(db, 'posts'), {
          title,
          category,
          country,
          imageURL: downloadURL,
          userId: auth.currentUser.uid,
          timestamp: serverTimestamp()
        });
        alert('Upload successful!');
        imageFile.value = '';
        itemTitle.value = '';
        itemCategory.value = 'Household';
        uploadModal.style.display = 'none';
      } catch (err) {
        console.error(err);
        alert('Firestore error: ' + err.message);
      }
    }
  );
});