import cabin from '../models/cabins.model.js';
import { isValidObjectId } from 'mongoose';
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
    if (!name || !city || !region || !numOfBeds || !phone || !price || !idOwner) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

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
        const { id } = req.params;
        const beforeDelete = await cabin.findById(id);
        const result = await cabin.findByIdAndDelete(id);        
        if (result) {
            const afterDelete = await cabin.findById(id);
            res.status(204).end();
        } else {
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
        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `cabin not found` } })
        }
        const ucabin = await cabin.findByIdAndUpdate(id, {
            $set: req.body,
        }, {
            new: true, 
            runValidators: true 
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
        const cabins = await cabin.find();
        res.json(cabins);
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}
export const getCabinByOwner = async (req, res) => {
    try {
        const { idOwner } = req.params;
    const cabins = await cabin.find({ idOwner: String(idOwner) });
        res.json(cabins);
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}

