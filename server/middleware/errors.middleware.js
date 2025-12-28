export const errorHandler = (err, req, res, next) => {
  const error = {
    message: err.msg || err.message || 'שגיאת שרת לא ידועה',
    type: err.type || 'ServerError',
    field: err.field,
    details: err.details || err.stack 
  };
  const status = err.status || 500;
  res.status(status).json({ error });
};