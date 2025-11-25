// feed.js
import { db } from './firebase.js';
import { collection, query, orderBy, limit, startAfter, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// DOM Elements
const featuredGrid = document.getElementById('featuredGrid');
const feedGrid = document.getElementById('feed');

let lastVisible = null;
let loading = false;

// Detect user country (fallback to client-side)
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

const userCountry = await getUserCountry();

// Load featured items (first 6 latest)
async function loadFeaturedItems() {
  const q = query(
    collection(db, 'posts'),
    orderBy('timestamp', 'desc'),
    limit(6)
  );

  const snapshot = await getDocs(q);
  featuredGrid.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.country === userCountry) {
      const item = createGridItem(data);
      featuredGrid.appendChild(item);
    }
  });
}

// Load main feed (infinite scroll)
async function loadFeed() {
  if (loading) return;
  loading = true;

  let q;
  if (lastVisible) {
    q = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible),
      limit(10)
    );
  } else {
    q = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
  }

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.country === userCountry) {
      const item = createGridItem(data);
      feedGrid.appendChild(item);
    }
  });

  loading = false;
}

// Create grid item element
function createGridItem(data) {
  const div = document.createElement('div');
  div.classList.add('grid-item');
  div.innerHTML = `
    <img src="${data.imageURL}" alt="${data.title}">
    <h3>${data.title}</h3>
  `;
  return div;
}

// Infinite scroll
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
    loadFeed();
  }
});

// Initial load
loadFeaturedItems();
loadFeed();