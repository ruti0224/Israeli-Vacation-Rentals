// בדיקת התחברות
if (!sessionStorage.getItem('idOwner')) {
  window.location.href = 'login.html';
}
function renderCabin() {
 const raw = sessionStorage.getItem('selectedCabin');
 const cabin = JSON.parse(raw);
  if (!cabin) return;

  // תמונות
  const imgContainer = document.getElementById("cabin-images");
  imgContainer.innerHTML = "";
  cabin.pictures.forEach(src => {
    const img = document.createElement("img");
    img.src = "../" + src;
    imgContainer.appendChild(img);
  });

  // פרטים
  const detailContainer = document.getElementById("cabin-details");
  detailContainer.innerHTML = `
    <h2>${cabin.name}</h2>
    <p><b>עיר:</b> ${cabin.city}</p>
    <p><b>מחיר ללילה:</b> ₪${cabin.price}</p>
    <p><b>מספר מיטות:</b> ${cabin.numOfBeds}</p>
    <p><b>טלפון:</b> ${cabin.phone}</p>
    <p>${cabin.description}</p>
  `;
}

renderCabin();
