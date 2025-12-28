import {model,Schema} from 'mongoose' ;
const orderSchema = new Schema({
   userId: { type: String, required: true }, 
  cabinId: { type: String, required: true }, 
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  guestsCount: { type: Number, required: true }, 
  totalPrice: { type: Number, required: true },
 });
const order = model('order',orderSchema)
export default order;