
// מקבל מה-DOM את האלמנטים של הטפסים והודעות
const form = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

// ============= מעבר בין טפסים =============
showRegister.addEventListener('click', function(e) {
  e.preventDefault();
  form.style.display = 'none';
  registerForm.style.display = 'block';
  loginMessage.textContent = '';
});

showLogin.addEventListener('click', function(e) {
  e.preventDefault();
  registerForm.style.display = 'none';
  form.style.display = 'block';
  registerMessage.textContent = '';
});

// ============= טופס התחברות =============
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const idNumber = form.idNumber.value.trim();
  const password = form.password.value.trim();
  
  // ולידציה בסיסית - שדות חסרים
  if (!idNumber || !password) {
    loginMessage.textContent = 'אנא מלא תעודת זהות וסיסמה';
    loginMessage.style.color = 'red';
    return;
  }

  try {
    console.log('שולח בקשת התחברות...');
    
    const response = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUsers: idNumber, pin: password })
    });

    console.log('קוד תגובה:', response.status);

    // בדיקה אם התגובה היא JSON
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      loginMessage.textContent = 'שגיאת שרת - התקבלה תגובה לא תקינה.';
      if (text.includes('Cannot GET') || text.includes('404')) {
        loginMessage.textContent = 'שגיאה: נתיב לא נמצא. בדוק את כתובת ה-API.';
      } else if (text.includes('500') || text.includes('Internal Server Error')) {
        loginMessage.textContent = 'שגיאת שרת פנימית. אנא נסה שוב מאוחר יותר.';
      } else {
        loginMessage.textContent = 'שגיאת שרת - התקבלה תגובה לא תקינה. בדוק קונסול.';
      }
      loginMessage.style.color = 'red';
      return;
    }

    const data = await response.json();
    console.log('תגובה מהשרת:', data);
    
    if (response.ok) {
      sessionStorage.setItem('idOwner', data.user.idUsers);
      sessionStorage.setItem('userType', data.user.role);
      sessionStorage.setItem('userName', data.user.name);
      
      loginMessage.textContent = 'התחברת בהצלחה! מעביר...';
      loginMessage.style.color = 'green';
      
      setTimeout(() => {
        window.location.href = 'main.html';
      }, 500);
    } else if (response.status === 400) {
      const isIdError = data.error?.details?.some(d => d.field === 'idUsers');
      if (isIdError) {
        loginMessage.textContent = 'תעודת זהות לא תקינה';
      } else {
        loginMessage.textContent = data.error?.message || 'שגיאה בוולידציה';
      }
      loginMessage.style.color = 'red';
    } else {
      loginMessage.textContent = data.error?.message || 'שגיאה בהתחברות';
      loginMessage.style.color = 'red';
    }
  } catch (err) {
    console.error(' שגיאה חמורה:', err);
    loginMessage.textContent = `שגיאה: ${err.message}`;
    loginMessage.style.color = 'red';
  }
});

// ============= טופס הרשמה =============
registerForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = registerForm.regName.value.trim();
  const idUsers = registerForm.regId.value.trim();
  const mail = registerForm.regMail.value.trim();
  const pin = registerForm.regPin.value.trim();
  const role = registerForm.regRole.value;
  
  if (!name || !idUsers || !mail || !pin || !role) {
    registerMessage.textContent = 'אנא מלא את כל השדות';
    registerMessage.style.color = 'red';
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, idUsers, mail, pin, role })
    });
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
     if (text.includes('Cannot GET') || text.includes('404')) {
        registerMessage.textContent = 'שגיאה: נתיב לא נמצא. בדוק את כתובת ה-API.';
      } else if (text.includes('500') || text.includes('Internal Server Error')) {
        registerMessage.textContent = 'שגיאת שרת פנימית. אנא נסה שוב מאוחר יותר.';
      } else {
        registerMessage.textContent = 'שגיאת שרת - התקבלה תגובה לא תקינה. בדוק קונסול.';
      }
      registerMessage.style.color = 'red';
      return;
    }

    const data = await response.json();
    console.log('תגובה מהשרת:', data);
    
    if (response.ok) {
      registerMessage.textContent = 'המשתמש נרשם בהצלחה! מעביר...';
      registerMessage.style.color = 'green';
      
      sessionStorage.setItem('idOwner', data.user.idUsers);
      sessionStorage.setItem('userType', data.user.role);
      sessionStorage.setItem('userName', data.user.name);
      
      registerForm.reset();
      
      setTimeout(() => {
        window.location.href = 'main.html';
      }, 500);
    } else if (response.status === 400) {
      const isIdError = data.error?.details?.some(d => d.field === 'idUsers');
      if (isIdError) {
        registerMessage.textContent = 'תעודת זהות לא תקינה';
      } else {
        registerMessage.textContent = data.error?.message || 'שגיאה בוולידציה';
      }
      registerMessage.style.color = 'red';
    } else if (response.status === 409) {
      if (data.error.field === 'idUsers') {
        registerMessage.innerHTML = '❌ תעודת זהות זו כבר רשומה במערכת.<br>אולי כדאי <a href="#" id="switch-to-login" style="color: blue; text-decoration: underline;">להתחבר</a>?';
        registerMessage.style.color = 'red';
          setTimeout(() => {
            const switchLink = document.getElementById('switch-to-login');
            if (switchLink) {
              switchLink.addEventListener('click', (e) => {
                e.preventDefault();
                showLogin.click();
                form.idNumber.value = idUsers;
                form.idNumber.focus();
              });
            }
          }, 100);
        } else if (data.error.field === 'mail') {
        registerMessage.textContent = ' כתובת המייל כבר רשומה במערכת';
        registerMessage.style.color = 'red';
      } else {
        registerMessage.textContent = data.error?.message || 'הפרטים כבר קיימים במערכת';
        registerMessage.style.color = 'red';
      }
    } else {
      registerMessage.textContent = data.error?.message || 'שגיאה בהרשמה';
      registerMessage.style.color = 'red';
    }
  } catch (err) {
    console.error(' שגיאה חמורה:', err);
    registerMessage.textContent = `שגיאה: ${err.message}`;
    registerMessage.style.color = 'red';
  }
});