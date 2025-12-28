import express from 'express';
import cabin from '../models/cabins.model.js';
import {
    addCabin,
    getAllCabins,
    getCabinByOwner,
    deleteCabin,
    updateCabin,
    getcabinbyid,
    getCabinsByRegion
} from '../controllers/cabinsController.js';

const router = express.Router();

// Routes ספציפיים ראשון!
router.get('/owner/:idOwner', getCabinByOwner);
router.get('/region/:region', getCabinsByRegion);

// Generic routes אחרון
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const found = await cabin.findById(id);
        if (!found) {
            return res.status(404).json({ msg: 'cabin not found' });
        }
        res.json(found);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

router.get('/', getAllCabins);
router.get('/:id', getcabinbyid);
router.post('/', addCabin);
router.delete('/:id', deleteCabin);
router.put('/:id', updateCabin);

export default router;