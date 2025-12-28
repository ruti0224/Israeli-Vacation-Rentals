// ====================== בדיקת התחברות ======================
if (!sessionStorage.getItem('idOwner') && !sessionStorage.getItem('userId')) {
  window.location.href = 'login.html';
}

// ====================== הצגת כפתורי בעלים ======================
document.addEventListener("DOMContentLoaded", function() {
  const userType = sessionStorage.getItem("userType"); 
  const sidebar = document.getElementById("ownerControls");
  const cabinsBtn = document.getElementById("ownerCabinsBtn");
  const ordersBtn = document.getElementById("ownerOrdersBtn");

  // מציג כפתורי ניהול רק אם המשתמש הוא בעלים (מתעלם מרווחים ורישיות)
  if (userType && userType.trim().toLowerCase() === "owner") {
    if (sidebar) sidebar.style.display = "block";
    if (cabinsBtn) cabinsBtn.style.display = "inline-block";
    if (ordersBtn) ordersBtn.style.display = "inline-block";
  } else {
    if (sidebar) sidebar.style.display = "none";
    if (cabinsBtn) cabinsBtn.style.display = "none";
    if (ordersBtn) ordersBtn.style.display = "none";
  }
});

// ====================== הצגת צימרים ולייקים ======================
async function displayCabins(list) {
  const container = document.getElementById("cabin-list");
  container.innerHTML = "";

  const userId = sessionStorage.getItem('idOwner') || sessionStorage.getItem('userId');
  let favorites = [];

  try {
    const res = await fetch(`http://localhost:3001/users/${userId}/favorites`);
    if (res.ok) {
      favorites = await res.json();
    }
  } catch (err) {
    console.error('שגיאה בשליפת הצימרים שאהבתי', err);
  }

  // בונה כרטיס לכל צימר
  list.forEach(c => {
    const card = document.createElement("div");
    card.className = "cabin-card";

    const isFavorite = favorites.includes(c._id);

    card.innerHTML = `
      <img src="${ "../" + c.pictures[0]}">
      <h3>${c.name}</h3>
      <div class="cabin-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>${c.city}, ${c.region}</span>
        </div>
      <p>₪${c.price} ללילה</p>
      <button class="like-btn">${isFavorite ? '❤️' : '♡'} אהבתי</button>
    `;

    card.querySelector(".like-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(c._id, e.target);
    });

    card.onclick = () => openCabin(c);

    container.appendChild(card);
  });
}

// ====================== סינון לפי אזור ======================
function filterByRegion(region) {
  if (region === "all") displayCabins(cabins);
  else displayCabins(cabins.filter(c => c.region === region));
}

// ====================== מעבר לעמוד צימר ======================
function openCabin(cabin) {
  sessionStorage.setItem('selectedCabin', JSON.stringify(cabin));
  window.location.href = 'cabin.html';
}

// ====================== לייק / אונלייק ======================
async function toggleFavorite(cabinId, btn) {
    const userId = sessionStorage.getItem('idOwner') || sessionStorage.getItem('userId');
    if (!userId) return alert("משתמש לא מחובר");
    try {
        // שליפה מהשרת – מערך הצימרים שאהב המשתמש
        const res = await fetch(`http://localhost:3001/users/${userId}/favorites`);
        if (!res.ok) throw new Error("שגיאה בשליפת אהובים");
        const favorites = await res.json();
        let method;
        if (favorites.some(fav => fav.toString() === cabinId.toString())) {
            method = 'DELETE'; 
        } else {
            method = 'POST'; 
        }

        const updateRes = await fetch(`http://localhost:3001/users/${userId}/favorites/${cabinId}`, {
            method,
            headers: { 'Content-Type': 'application/json' }
        });

        if (!updateRes.ok) throw new Error("שגיאה בעדכון אהובים");

        // עדכון הכפתור
        btn.textContent = method === 'POST' ? '❤️ אהבתי' : '♡ אהבתי';
        
    } catch (err) {
        console.error('Error in toggleFavorite:', err);
        alert("שגיאה בעדכון אהובים");
    }
}

// ====================== כפתור "הצימרים שאהבתי" ======================
document.getElementById("favoritesBtn").addEventListener("click", () => {
  window.location.href = "favorites.html";
});

// ====================== טעינת צימרים מהשרת ======================
let cabins = []; 
async function initPage() {
  try {
    const res = await fetch('http://localhost:3001/cabins');     
    if (res.ok) {
      cabins = await res.json(); 
      displayCabins(cabins);     
    } else {
      console.error(" בעיה בטעינת הצימרים מהשרת", res.status);
    }
  } catch (err) {
    console.error(' שגיאה בשליפת הצימרים', err);
  }
}
initPage();