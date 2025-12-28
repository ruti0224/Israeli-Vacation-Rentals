export const validateJoiSchema = function (joiSchema) {
  return (req, res, next) => {
    const { value, error } = joiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      const fields = error.details.map(detail => detail.path.join('.'));
      return next({ 
        status: 400, 
        type: 'validation', 
        msg: errorMessages,
        field: fields.length > 0 ? fields[0] : undefined 
      });
    }
    req.body = value;
    next();
  };
};