import User from '../models/users.model.js';
import { isValidObjectId } from 'mongoose';

// ====== USERS ======
export async function loginUser(req, res) {
  try {
    const { idUsers, pin } = req.body;
    if (!idUsers || !pin) {
      return res.status(400).json({ error: { message: 'חסר תעודת זהות או סיסמה', type: 'validation' } });
    }
    const user = await User.findOne({ idUsers });
    if (!user) {
      return res.status(401).json({ error: { message: 'תעודת זהות לא קיימת', type: 'auth' } });
    }
    const isMatch = await user.comparePin(pin);
    if (!isMatch) {
      return res.status(401).json({ error: { message: 'סיסמה שגויה', type: 'auth' } });
    }
    const userResponse = {
      _id: user._id,
      name: user.name,
      idUsers: user.idUsers,
      mail: user.mail,
      role: user.role,
      ownedCabins: user.ownedCabins,
      favoriteCabins: user.favoriteCabins
    };
    res.status(200).json({ 
      message: 'התחברות הצליחה', 
      user: userResponse 
    });
  } catch (error) {
    console.error('שגיאה ב-loginUser:', error);
    next(error);
  }
}

export async function addUser(req, res) {
  try {
    const { name, idUsers, mail, pin, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ idUsers }] });
    if (existingUser) {
        return res.status(409).json({ 
          error: { message: 'תעודת זהות זו כבר רשומה במערכת', type: 'duplicate', field: 'idUsers' }
        });
    }
    const newUser = new User({ name, idUsers, mail, pin, role });
    await newUser.save();
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      idUsers: newUser.idUsers,
      mail: newUser.mail,
      role: newUser.role
    };
    res.status(201).json({ 
      message: 'משתמש נוסף בהצלחה', 
      user: userResponse 
    });
  } catch (error) {
    console.error('שגיאה ב-addUser:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const fieldNames = {
        idUsers: 'תעודת הזהות',
        mail: 'כתובת המייל'
      };
      return res.status(409).json({ 
        error: { 
          message: `${fieldNames[field] || 'השדה'} כבר קיים במערכת`,
          type: 'duplicate',
          field 
        }
      });
    }
    next(error);
  }
}
export const getUserbytz = async (req, res) => {
  try {
    const { idUsers } = req.params;
    const founduser = await User.findOne({ idUsers: idUsers }); 
    if (!founduser) {
      return res.status(404).json({ error: { message: "user not found" } });
    }
    res.json(founduser);
  } catch (error) {
    console.error('Error in getUserbytz:', error);
    res.status(500).json({ error: { message: error.message } });
  }
};

// ====== FAVORITES ======
export async function getFavorites(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findOne({ idUsers: id });
    if (!user) 
      return res.status(404).json({ msg: "משתמש לא נמצא" });
    res.json(user.favoriteCabins || []);
  } catch (error) {
    console.error('Error getting favorites:', error);
    next(error);
  }
}

export async function addFavorite(req, res) {
  try {
    const { id, cabinId } = req.params;
    if (!isValidObjectId(cabinId)) {
      return res.status(400).json({ msg: "מזהה צימר לא תקין" });
    }
    
    const user = await User.findOne({ idUsers: id });
    if (!user) 
      return res.status(404).json({ msg: "משתמש לא נמצא" });
    const alreadyExists = user.favoriteCabins.some(fav => fav.toString() === cabinId);
    if (!alreadyExists) {
      user.favoriteCabins.push(cabinId);
      await user.save();
    }
    res.status(200).json({ msg: "צימר נוסף למועדפים" });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req, res) {
  try {
    const { id, cabinId } = req.params;
    const user = await User.findOne({ idUsers: id });
    if (!user) return res.status(404).json({ msg: "משתמש לא נמצא" });
    
    user.favoriteCabins = user.favoriteCabins.filter(
      fav => fav.toString() !== cabinId
    );
    await user.save();
    
    res.status(200).json({ msg: "צימר הוסר מהמועדפים" });
  } catch (error) {
    next(error);
  }
}