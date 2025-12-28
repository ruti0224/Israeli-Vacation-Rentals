
// בדיקת התחברות
if (!sessionStorage.getItem('idOwner')) {
  window.location.href = 'login.html';
}

const form = document.getElementById("orderForm");
const successMessage = document.getElementById("successMessage");
const dateStartInput = document.getElementById("dateStart");
const dateEndInput = document.getElementById("dateEnd");
const totalPriceInput = document.getElementById("totalPrice");

// קבלת cabinId מה-URL
const urlParams = new URLSearchParams(window.location.search);
const cabinId = urlParams.get('cabinId');
let pricePerNight = 0;
let numOfBeds = null;

// פונקציה שמחזירה מערך של כל התאריכים התפוסים עבור הצימר (לא כולל יום ה-checkout)
async function getUnavailableDates(cabinId) {
  try {
    const res = await fetch('http://localhost:3001/orders', { method: 'GET' });
    if (!res.ok) {
      console.error('נכשל בשליפת תאריכים תפוסים');
      return [];
    }
    const orders = await res.json();
    const cabinOrders = orders.filter(o => o.cabinId === cabinId);
    let dates = [];
    cabinOrders.forEach(order => {
      let start = new Date(order.dateStart);
      const end = new Date(order.dateEnd);
      while (start < end) {
        dates.push(start.toISOString().slice(0,10));
        
        start.setDate(start.getDate() + 1);
      }
    });

    return dates;
  } catch (err) {
    console.error('שגיאה בשליפת תאריכים תפוסים:', err);
    return [];
  }
}

// שליפת מחיר ללילה ומספר מיטות מהשרת
if (cabinId) {
  fetch(`http://localhost:3001/cabins/${cabinId}`)
    .then(res => res.json())
    .then(cabin => {
      pricePerNight = cabin.price;
      numOfBeds = cabin.numOfBeds;
      updateTotalPrice();
    });
}

// אתחול flatpickr
document.addEventListener('DOMContentLoaded', async function() {
  if (typeof flatpickr === 'undefined') return;
  const startDateInput = document.getElementById('dateStart');
  const endDateInput = document.getElementById('dateEnd');
  if (!startDateInput || !endDateInput) return;

  const unavailable = await getUnavailableDates(cabinId);
  const today = new Date();
  const minDate = today.toISOString().slice(0,10);

  // flatpickr ל-dateStart
  flatpickr(startDateInput, {
    minDate,
    locale: {
      firstDayOfWeek: 0,
      weekdays: {
        shorthand: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
        longhand: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
      },
      months: {
        shorthand: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
        longhand: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
      }
    },
    onDayCreate: function(dObj, dStr, fp, dayElem) {
      const dateStr = dayElem.dateObj.toISOString().slice(0,10);
      if (unavailable.includes(dateStr)) {
        dayElem.classList.add('unavailable');
        dayElem.setAttribute('aria-disabled', 'true');
        dayElem.style.background = '#ff1744';
        dayElem.style.color = '#fff';
        dayElem.style.fontWeight = 'bold';
        dayElem.style.cursor = 'not-allowed';
        dayElem.style.opacity = '1';
      }
    },
    onChange: function(selectedDates, dateStr) {
      endDateInput._flatpickr.set('minDate', dateStr || minDate);
      updateTotalPrice();
    }
  });

  // flatpickr ל-dateEnd
  flatpickr(endDateInput, {
    minDate,
    locale: {
      firstDayOfWeek: 0,
      weekdays: {
        shorthand: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
        longhand: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
      },
      months: {
        shorthand: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
        longhand: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
      }
    },
    onDayCreate: function(dObj, dStr, fp, dayElem) {
      const dateStr = dayElem.dateObj.toISOString().slice(0,10);
      if (unavailable.includes(dateStr)) {
        dayElem.classList.add('unavailable');
        dayElem.setAttribute('aria-disabled', 'true');
        dayElem.style.background = '#ff1744';
        dayElem.style.color = '#fff';
        dayElem.style.fontWeight = 'bold';
        dayElem.style.cursor = 'not-allowed';
        dayElem.style.opacity = '1';
      }
    },
    onChange: function(selectedDates, dateStr) {
      updateTotalPrice();
    }
  });
});

function getNights() {
  const start = new Date(dateStartInput.value);
  const end = new Date(dateEndInput.value);
  const diff = (end - start) / (1000 * 60 * 60 * 24);
  return diff > 0 ? diff : 0;
}

function updateTotalPrice() {
  const nights = getNights();
  totalPriceInput.value = nights * pricePerNight;
}

dateStartInput.addEventListener('change', function() {
  dateEndInput.min = dateStartInput.value;
  if (dateEndInput.value < dateStartInput.value) {
    dateEndInput.value = dateStartInput.value;
  }
  updateTotalPrice();
});

dateEndInput.addEventListener('change', function() {
  if (dateEndInput.value < dateStartInput.value) {
    dateEndInput.value = dateStartInput.value;
  }
  updateTotalPrice();
});

form.addEventListener("submit", async (e) => {
  
  e.preventDefault();

  const guestsCount = form.guestsCount ? Number(form.guestsCount.value) : 1;
  if (numOfBeds !== null && guestsCount > numOfBeds) {
    successMessage.textContent = `לא ניתן להזמין יותר מ-${numOfBeds} נפשות לצימר זה.`;
    return;
  }

  const userId = form.userId.value;
  try {
    const userRes = await fetch(`http://localhost:3001/users/${userId}`, { method: 'GET' });
    if (userRes.status==404) {
      successMessage.textContent = "המשתמש לא קיים במערכת. לא ניתן להוסיף לו הזמנה.";
      return;
    }
    if (!userRes.ok) {
      successMessage.textContent = "שגיאה בבדיקת המשתמש. נסה שוב.";
      return;
    }
    const user = await userRes.json();
    console.log('בדיקת משתמש:', user); // הוספתי שורה
    
    
  
  } catch (err) {
    successMessage.textContent = "שגיאה בבדיקת המשתמש. נסה שוב.";
    return;
  }
  

  const orderData = {
    userId: userId,
    cabinId: cabinId,
    dateStart: form.dateStart.value,
    dateEnd: form.dateEnd.value,
    guestsCount: guestsCount,
    totalPrice: totalPriceInput.value
  };

  const response = await fetch("http://localhost:3001/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  
  const result = await response.json();

  if (response.ok) {
    successMessage.textContent = "ההזמנה נשמרה בהצלחה!";
    setTimeout(() => {
        form.reset();
    updateTotalPrice();
    location.reload();
      }, 500);
    
  } else {
    successMessage.textContent = result.msg || "שגיאה בשמירת ההזמנה";
  }
});




