
if (!sessionStorage.getItem('idOwner')) {
  window.location.href = 'login.html';
}
document.addEventListener('DOMContentLoaded', async () => {
  const userId = sessionStorage.getItem('idOwner');
  const container = document.getElementById('favorites-list');
  
  if (!userId) {
    container.innerHTML = '<p class="error-message">משתמש לא מחובר.</p>';
    return;
  }

  container.innerHTML = '<div class="loading-state"><p>טוען צימרים...</p></div>';
  let cabins = [];
  try {
    const res = await fetch('/cabins');
    if (res.ok) {
      cabins = await res.json();
    }
  } catch (err) {
    container.innerHTML = '<p class="error-message">שגיאה בטעינת הצימרים.</p>';
    return;
  }

  let favorites = [];
  try {
    const favRes = await fetch(`/users/${userId}/favorites`);
    if (favRes.ok) {
      favorites = await favRes.json(); 
    }
  } catch (err) {
    container.innerHTML = '<p class="error-message">שגיאה בטעינת רשימת האהובים.</p>';
    return;
  }

  const favoriteCabins = cabins.filter(c => favorites.includes(c._id));
  container.innerHTML = '';
  
  if (favoriteCabins.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-heart">❤️</div>
        <h2>לא סימנת עדיין צימרים שאהבת.</h2>
        <p>התחל לאסוף את הצימרים האהובים עליך!</p>
        <button class="btn-home" onclick="window.location.href='main.html'">חזרה לעמוד הבית</button>
      </div>
    `;
    return;
  }

  const gridDiv = document.createElement('div');
  gridDiv.className = 'cabins-grid';

  favoriteCabins.forEach(c => {
    const card = document.createElement('div');
    card.className = 'cabin-card';
    card.innerHTML = `
      <div class="card-image-wrapper">
        <img src="../${c.pictures[0]}" alt="${c.name}" class="card-image">
        <div class="favorite-badge">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>
      <div class="card-content">
        <h3 class="cabin-name">${c.name}</h3>
        <div class="cabin-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>${c.city}, ${c.region}</span>
        </div>
        <div class="card-footer">
          <div class="price-info">
            <span class="price-amount">₪${c.price}</span>
            <span class="price-period">ללילה</span>
          </div>
          <button class="btn-book">צפה בפרטים</button>
        </div>
      </div>
    `;
    
    card.onclick = () => {
      sessionStorage.setItem('selectedCabin', JSON.stringify(c));
      window.location.href = 'cabin.html';
    };
    
    gridDiv.appendChild(card);
  });

  container.appendChild(gridDiv);
});
