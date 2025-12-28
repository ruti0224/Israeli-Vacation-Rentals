import { model, Schema } from 'mongoose';

const cabinsSchema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  numOfBeds: { type: Number, required: true },
  phone: { type: String, required: true }, 
  price: { type: Number, required: true },
  description: { type: String },
  pictures: [{ type: String }], 
  idOwner: { type: String, required: true }
});

const Cabin = model('Cabin', cabinsSchema);
export default Cabin;





