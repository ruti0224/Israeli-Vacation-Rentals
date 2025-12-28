// ownerOrders.js
// מציג את כל ההזמנות של הצימרים שבבעלות המשתמש הנוכחי

document.addEventListener('DOMContentLoaded', async () => {
  // קבלת idOwner מהמשתמש הנוכחי
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};
  const idOwner = user.tz || sessionStorage.getItem('idOwner');
  if (!idOwner) {
    document.getElementById('ordersList').innerHTML = '<p>לא נמצאה כניסה תקינה למערכת.</p>';
    return;
  }
  try {
    const res = await fetch(`http://localhost:3001/orders/byOwner/${idOwner}`);
    const orders = await res.json();
    if (!orders.length) {
      document.getElementById('ordersList').innerHTML = '<p>לא נמצאו הזמנות לצימרים שלך.</p>';
      return;
    }
    renderOrders(orders);
  } catch (err) {
    document.getElementById('ordersList').innerHTML = '<p>שגיאה בטעינת ההזמנות.</p>';
  }
});
async function deleteOrder(orderId) {
  try {
    const res = await fetch(`http://localhost:3001/orders/${orderId}`, { method: 'DELETE' })}
    catch (err) {
    console.error('שגיאה במחיקת ההזמנה:', err);
  }
}

async function renderOrders(orders) {
  const container = document.getElementById('ordersList');
  container.innerHTML = '';
  for (const order of orders) {
  try {
    const res = await fetch(`http://localhost:3001/cabins/${order.cabinId}`);
    const cabin = await res.json();
   
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <p><strong>שם צימר:</strong> ${cabin.name}</p>
      <p><strong>תעודת זהות מזמין:</strong> ${order.userId}</p>
      <p><strong>תאריכים:</strong> ${new Date(order.dateStart).toLocaleDateString()} - ${new Date(order.dateEnd).toLocaleDateString()}</p>
      <p><strong>כמות נפשות:</strong> ${order.guestsCount}</p>
      <p><strong>מחיר כולל:</strong> ${order.totalPrice} ₪</p>
      <button class="deleteO">מחיקת הזמנה</button>
    `;
    card.querySelector(".deleteO").addEventListener("click", (e) => {
      let res=alert(' אתה בטוח שברצונך למחוק הזמנה זו?');
      if (res==undefined){
        deleteOrder(order._id);
        card.remove();}
      });
    container.appendChild(card);} 
    catch (err) {
    document.getElementById('ordersList').innerHTML = '<p>שגיאה בטעינת ההזמנות.</p>';
  }
  };
}

