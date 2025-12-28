import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const usersSchema = new Schema({
  name: { type: String, required: true },
  idUsers: { type: String, required: true, unique: true },
  mail: { type: String, required: true, unique: true, lowercase: true },
  pin: { type: String, required: true },
  role: { type: String, enum: ["user", "owner"], required: true },
  ownedCabins: [{ type: Schema.Types.ObjectId, ref: "Cabin" }],
  favoriteCabins: [{ type: Schema.Types.ObjectId, ref: "Cabin" }]
});
usersSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('pin')) {
    try {
      const salt = await bcrypt.genSalt(12);
      this.pin = await bcrypt.hash(this.pin, salt);
    } catch (err) {
      console.error(' שגיאה בהצפנת סיסמה:', err);
      return next(err);
    }
  }
  next();
});

// פונקציה להשוואת סיסמאות
usersSchema.methods.comparePin = async function (candidatePin) {
  try {
    const isMatch = await bcrypt.compare(candidatePin, this.pin);
    return isMatch;
  } catch (err) {
    console.error(' שגיאה בהשוואת סיסמאות:', err);
    return false;
  }
};

// ולידציות Joi
export const validUser = {
  login: Joi.object({
    idUsers: Joi.string()
      .required()
      .custom((value, helpers) => {
        const digits = value.replace(/[^0-9]/g, '');
        if (!/^[0-9]{5,9}$/.test(digits)) {
          return helpers.error('any.invalid', { 
            message: 'תעודת זהות חייבת להכיל 5-9 ספרות' 
          });
        }
        const id = digits.padStart(9, '0');
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          let num = Number(id[i]);
          let mult = num * ((i % 2) + 1);
          if (mult > 9) mult -= 9;
          sum += mult;
        }
        if (sum % 10 !== 0) {
          return helpers.error('any.invalid', { 
            message: 'תעודת זהות לא תקינה' 
          });
        }
        return value;
      }, 'Israeli ID validation'),
    pin: Joi.string()
      .min(3)
      .required()
      .messages({
        'string.min': 'הסיסמה חייבת להכיל לפחות 3 תווים',
        'string.pattern.base': 'הסיסמה חייבת לכלול אותיות קטנות, גדולות ומספרים',
        'any.required': 'סיסמה היא שדה חובה'
      })
  }),
  register: Joi.object({
    name: Joi.string()
      .min(2)
      .trim()
      .required()
      .messages({
        'string.min': 'השם חייב להכיל לפחות 2 תווים',
        'any.required': 'שם הוא שדה חובה'
      }),
    idUsers: Joi.string()
      .required()
      .custom((value, helpers) => {
        const digits = value.replace(/[^0-9]/g, '');
        if (!/^[0-9]{5,9}$/.test(digits)) {
          return helpers.error('any.invalid', { 
            message: 'תעודת זהות חייבת להכיל 5-9 ספרות' 
          });
        }
        const id = digits.padStart(9, '0');
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          let num = Number(id[i]);
          let mult = num * ((i % 2) + 1);
          if (mult > 9) mult -= 9;
          sum += mult;
        }
        if (sum % 10 !== 0) {
          return helpers.error('any.invalid', { 
            message: 'תעודת זהות לא תקינה' 
          });
        }
        return value;
      }, 'Israeli ID validation'),
    mail: Joi.string()
      .email({ tlds: { allow: false } })
      .lowercase()
      .required()
      .messages({
        'string.email': 'כתובת המייל אינה תקינה',
        'any.required': 'מייל הוא שדה חובה'
      }),
    pin: Joi.string()
      .min(3)
      .required()
      .messages({
        'string.pattern.base': 'הסיסמה חייבת לכלול אותיות קטנות, גדולות ומספרים',
        'any.required': 'סיסמה היא שדה חובה'
      }),
    role: Joi.string()
      .valid('user', 'owner')
      .required()
      .messages({
        'any.only': 'תפקיד לא תקין (חייב להיות user או owner)',
        'any.required': 'תפקיד הוא שדה חובה'
      })
  })
};
const User = model('User', usersSchema);
export default User;