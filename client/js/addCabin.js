
if (!sessionStorage.getItem('idOwner')) {
  window.location.href = 'login.html';
}
const form = document.getElementById('cabinForm');
const successMessage = document.getElementById('successMessage');

let cabinId = null;
window.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  cabinId = urlParams.get('id');
  if (cabinId) {
    try {
      const res = await fetch(`http://localhost:3001/cabins/${cabinId}`);
      const cabin = await res.json();
      if (cabin) {
        form.name.value = cabin.name || '';
        form.city.value = cabin.city || '';
        form.region.value = cabin.region || '';
        form.guestsCount.value = cabin.numOfBeds || '';
        form.phone.value = cabin.phone || '';
        form.price.value = cabin.price || '';
        form.description.value = cabin.description || '';
        form.pictures.value = (cabin.pictures || []).join(', ');
        document.getElementById('cabinFormTitle').textContent = 'עדכון צימר';
        document.getElementById('cabinFormBtn').textContent = 'שמור שינוי';
      }
    } catch (err) {
      successMessage.textContent = 'שגיאה בטעינת נתוני הצימר';
      successMessage.style.color = 'red';
    }
  }
});

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = form.name.value;
  const city = form.city.value;
  const numOfBeds = form.guestsCount.value;
  const phone = form.phone.value;
  const price = form.price.value;
  const description = form.description.value;
  const picturesRaw = form.pictures.value;
  const pictures = picturesRaw.split(',').map(url => url.trim()).filter(url => url);
  const region = form.region ? form.region.value : "צפון";
  let idOwner = null;
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user && user.tz) {
    idOwner = String(user.tz);
  } else {
    idOwner = String(sessionStorage.getItem('idOwner'));
  }

  try {
    let response, data;
    if (cabinId) {
      // עדכון צימר
      response = await fetch(`http://localhost:3001/cabins/${cabinId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          city,
          region,
          numOfBeds,
          phone,
          price,
          description,
          pictures,
          idOwner
        })
      });
      data = await response.json();
      if (response.ok) {
        successMessage.textContent = 'הצימר עודכן בהצלחה!';
        successMessage.style.color = 'green';
      } else {
        successMessage.textContent = data.msg || 'שגיאה בעדכון';
        successMessage.style.color = 'red';
      }
    } else {
      // הוספת צימר
      response = await fetch('http://localhost:3001/cabins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          city,
          region,
          numOfBeds,
          phone,
          price,
          description,
          pictures,
          idOwner
        })
      });
      data = await response.json();
      if (response.ok) {
        successMessage.textContent = "הצימר נוסף בהצלחה!";
        successMessage.style.color = "green";
        form.reset();
      } else {
        successMessage.textContent = data.msg || "שגיאה בהוספה";
        successMessage.style.color = "red";
      }
    }
  } catch (err) {
    successMessage.textContent = "שגיאת רשת";
    successMessage.style.color = "red";
  }
});
