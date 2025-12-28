import express from 'express';
const router = express.Router();
import {
    addOrder,
   getAllOrders,
    deleteOrder,
    // updateOrder,
    getOrdersByOwner
} from '../controllers/ordersController.js';

router.get('/', getAllOrders);
// כל ההזמנות לכל הצימרים של בעל צימר מסוים
router.get('/byOwner/:idOwner', getOrdersByOwner);
router.post('/',addOrder);
router.delete('/:id', deleteOrder);
// router.put('/:id',updateOrder);
export default router;