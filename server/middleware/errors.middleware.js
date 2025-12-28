export const errorHandler = (err, req, res, next) => {
  console.error('שגיאה בשרת:', err.stack); // רישום השגיאה לטובת דיבאגינג
  const error = {
    message: err.msg || err.message || 'שגיאת שרת לא ידועה',
    type: err.type || 'ServerError',
    field: err.field,
    details: err.details || err.stack // הוספת פירוט נוסף אם קיים
  };
  const status = err.status || 500;
  res.status(status).json({ error }); // תמיד מחזיר JSON
};