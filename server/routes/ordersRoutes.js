import express from 'express';
const router = express.Router();
import {
    addOrder,
   getAllOrders,
    deleteOrder,
    getOrdersByOwner
} from '../controllers/ordersController.js';

router.get('/', getAllOrders);
router.get('/byOwner/:idOwner', getOrdersByOwner);
router.post('/',addOrder);
router.delete('/:id', deleteOrder);
export default router;