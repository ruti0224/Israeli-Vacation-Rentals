import cabin from '../models/cabins.model.js';
import { isValidObjectId } from 'mongoose';
// controllers/cabinController.js
export const getCabinsByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const cabins = await cabin.find({ region: region }); 
    res.json(cabins);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};


export const getcabinbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const cabin1 = await cabin.findById(id); 
    res.json(cabin1);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const  addCabin=async(req,res)=>{
  try {
    const {  name, city, region, numOfBeds, phone, price, description,pictures, idOwner } = req.body;
    // וידוא שמתקבלים הנתונים הנחוצים
    if (!name || !city || !region || !numOfBeds || !phone || !price || !idOwner) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // יצירת הצימר
    const newCabin = new cabin({
      name,
      city,
      region,
      numOfBeds,
      phone,
      price,
      description,
      pictures,
      idOwner
    });

    await newCabin.save();
    res.status(201).json({ msg: "Cabin added successfully", cabin: newCabin });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
} 

export const deleteCabin = async (req, res) => {
    try {
        console.log('DELETE request received for ID:', req.params.id);
        
        const { id } = req.params;
        
        // בדיקה לפני המחיקה
        const beforeDelete = await cabin.findById(id);
        console.log('Before delete - cabin exists:', beforeDelete ? 'YES' : 'NO');
        
        const result = await cabin.findByIdAndDelete(id);
        console.log('Delete result:', result ? 'Found and deleted' : 'Not found');
        
        if (result) {
            // בדיקה אחרי המחיקה
            const afterDelete = await cabin.findById(id);
            console.log('After delete - cabin still exists:', afterDelete ? 'YES - PROBLEM!' : 'NO - SUCCESS');
            
            console.log('Cabin deleted successfully, name was:', result.name);
            res.status(204).end();
        } else {
            console.log('Cabin not found in database');
            res.status(404).json({ msg: 'Cabin not found' });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};


export const updateCabin = async (req, res) => {
    try {
        const { id } = req.params;

        // בדיקה האם האיי-די חוקי
        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `cabin not found` } })
        }

        const ucabin = await cabin.findByIdAndUpdate(id, {
            $set: req.body,
            // $set: { name: 'abc' }, // הוספת/עדכון שדה
            // $unset: { price: true }, // מחיקת שדה
            // $inc: { amount: -1 } // קידום
        }, {
            new: true, // החזרת האוביקט המעודכן
            runValidators: true // בדיקת תקינות לפי המודל
        });

        if (!ucabin ) {
            res.status(404).json({ error: { message: 'cabin not found' } });
        }
        else {
            res.json(ucabin);
        }
    } catch (error) {
        res.status(400).json(error)
    }
};
export const getAllCabins = async (req, res) => {
    try {
        // SELECT * FROM users
        const cabins = await cabin.find();

        // שליחה ללקוח בפורמט JSON
        res.json(cabins);
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}
export const getCabinByOwner = async (req, res) => {
    try {
        const { idOwner } = req.params;
        // השוואה כמחרוזת
    const cabins = await cabin.find({ idOwner: String(idOwner) });
        res.json(cabins);
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}

