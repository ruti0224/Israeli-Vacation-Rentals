// ownerCabins.js
// מציג את כל הצימרים של הבעלים הנוכחי

document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};
  const idOwner = user.tz || sessionStorage.getItem('idOwner');
  if (!idOwner) {
    document.getElementById('cabinsList').innerHTML = '<p>לא נמצאה כניסה תקינה למערכת.</p>';
    return;
  }
  try {
    const res = await fetch(`http://localhost:3001/cabins/owner/${idOwner}`);
    const cabins = await res.json();
    if (!cabins.length) {
      document.getElementById('cabinsList').innerHTML = '<p>לא נמצאו צימרים בבעלותך.</p>';
      return;
    }
    renderCabins(cabins);
  } catch (err) {
    document.getElementById('cabinsList').innerHTML = '<p>שגיאה בטעינת הצימרים.</p>';
  }
});

function renderCabins(cabins) {
  const container = document.getElementById('cabinsList');
  container.innerHTML = '';
  cabins.forEach(cabin => {
    const card = document.createElement('div');
    card.className = 'cabin-card';
    card.innerHTML = `
      <img src="${"../"+cabin.pictures[0]}">
      <h3>${cabin.name}</h3>
      <p class="cabin-row"><span class="label">עיר:</span><span class="value">${cabin.city}</span></p>
      <p class="cabin-row"><span class="label">אזור:</span><span class="value">${cabin.region}</span></p>
      <p class="cabin-row"><span class="label">מספר מיטות:</span><span class="value">${cabin.numOfBeds}</span></p>
      <p class="cabin-row"><span class="label">מחיר ללילה:</span><span class="value">₪${cabin.price}</span></p>
      <p class="cabin-row"><span class="label">טלפון:</span><span class="value">${cabin.phone}</span></p>
      <p class="cabin-row"><span class="label">תיאור:</span><span class="value">${cabin.description || ''}</span></p>
      <div style="display:flex;gap:10px;margin-top:10px;">
        <button class="delete-cabin-btn"  data-id="${cabin._id}">מחק</button>
        <button class="update-cabin-btn"  data-id="${cabin._id}">עדכן</button>
        <button class="add-order-btn"  data-id="${cabin._id}">הוספת הזמנה לצימר זה</button>

      </div>
    `;
    container.appendChild(card);
  });

  // מאזינים לכפתורי מחיקה
  document.querySelectorAll('.delete-cabin-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const id = this.getAttribute('data-id');
      console.log('Frontend: Attempting to delete cabin with ID:', id); // הוספתי שורה
      
      if (confirm('האם למחוק את הצימר?')) {
        try {
          const res = await fetch(`http://localhost:3001/cabins/${id}`, { method: 'DELETE' });
          console.log('Frontend: Response status:', res.status); // הוספתי שורה
          
          if (res.status === 204) {
            alert('הצימר נמחק בהצלחה');
            location.reload();
          } else {
            const data = await res.json();
            alert(data.msg || 'שגיאה במחיקה');
          }
        } catch (err) {
          console.error('Frontend error:', err); // הוספתי שורה
          alert('שגיאת רשת');
        }
      }
    });
  });

  // מאזינים לכפתורי עדכון
  document.querySelectorAll('.update-cabin-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      window.location.href = `addCabin.html?id=${id}`;
    });
  });
  document.querySelectorAll('.add-order-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      window.location.href = `addOrder.html?cabinId=${id}`;
    });
  });
}