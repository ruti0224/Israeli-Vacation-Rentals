import {model,Schema} from 'mongoose' ;
const orderSchema = new Schema({
   userId: { type: String, required: true }, // מזהה המשתמש
  cabinId: { type: String, required: true }, // מזהה הצימר
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  guestsCount: { type: Number, required: true }, // כמות נפשות
  totalPrice: { type: Number, required: true },
 });
const order = model('order',orderSchema)
export default order;