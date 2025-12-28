import cabin from '../models/cabins.model.js';
import order from '../models/orders.model.js';
import { isValidObjectId } from 'mongoose';

// מחזיר את כל ההזמנות לכל הצימרים של בעל צימר מסוים
export const getOrdersByOwner = async (req, res) => {
  try {
    const { idOwner } = req.params;
    if (!idOwner) {
      return res.status(400).json({ msg: 'Missing owner id' });
    }
    // שליפת כל הצימרים של הבעלים
  const cabins = await cabin.find({ idOwner: String(idOwner) }); // idOwner הוא String
    const cabinIds = cabins.map(c => c._id.toString());
    // שליפת כל ההזמנות עבור הצימרים הללו
    const orders = await order.find({ cabinId: { $in: cabinIds } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

export const addOrder = async (req, res) => {
  try {
    debugger  ;
    const { userId, cabinId, dateStart, dateEnd, totalPrice, guestsCount } = req.body;
    if (!userId || !cabinId || !dateStart || !dateEnd || !totalPrice  || !guestsCount) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
  
    // בדיקת זמינות תאריכים
    // מותר להזמין אם dateStart שווה ל-dateEnd של הזמנה קיימת (כלומר, כניסה אחרי יציאה)
   const overlappingOrder = await order.findOne({
  cabinId,
  dateStart: { $lt: dateEnd }, 
  dateEnd: { $gt: dateStart }
});

if (overlappingOrder) {
  return res.status(400).json({ msg: "התאריכים אינם זמינים לצימר זה" });
}
    // בדיקת guestsCount מול numOfBeds
    const cabinDoc = await cabin.findById(cabinId);
    if (!cabinDoc) {
      return res.status(404).json({ msg: "הצימר לא נמצא" });
    }
    if (Number(guestsCount) > cabinDoc.numOfBeds) {
      return res.status(400).json({ msg: `לא ניתן להזמין יותר מ-${cabinDoc.numOfBeds} נפשות לצימר זה.` });
    }
    const newOrder = new order({
      userId,
      cabinId,
      dateStart,
      dateEnd,
      totalPrice,
      guestsCount
    });
    await newOrder.save();
    res.status(201).json({ msg: "Order added successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {

    const orders = await order.find();
    res.json(orders);
  } catch (error) {
    console.log('ssss:');
    res.status(500).json({ error: { message: error.message } });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({ error: { message: "Order not found" } });
    }
    const foundOrder = await order.findById(id);
    if (!foundOrder) {
      return res.status(404).json({ error: { message: "Order not found" } });
    }
    res.json(foundOrder);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// export const updateOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isValidObjectId(id)) {
//       return res.status(404).json({ error: { message: "Order not found" } });
//     }
    
//     // בדיקת זמינות תאריכים לפני עדכון
//     const { cabinId, dateStart, dateEnd } = req.body;
//     if (cabinId && dateStart && dateEnd) {
//       const overlappingOrder = await order.findOne({
//         cabinId,
//         _id: { $ne: id }, // לא להזמנה הנוכחית
//         dateStart: { $lt: dateEnd },
//         dateEnd: { $gt: dateStart }
//       });

//       if (overlappingOrder) {
//         return res.status(400).json({ msg: "התאריכים אינם זמינים לצימר זה" });
//       }
//     } 
//     const updatedOrder = await order.findByIdAndUpdate(id, {
//       $set: req.body
//     }, {
//       new: true,
//       runValidators: true
//     });
    
//     if (!updatedOrder) {
//       return res.status(404).json({ error: { message: "Order not found" } });
//     }
    
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({ error: { message: "Order not found" } });
    }
    const deletedOrder = await order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ error: { message: "Order not found" } });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json(error);
  }
};






