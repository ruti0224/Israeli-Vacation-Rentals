import express from 'express';
import { validateJoiSchema } from "../middleware/validate.middleware.js";
import { validUser } from "../models/users.model.js";


const router = express.Router();
import {
    addUser,
    getUserbytz,
    loginUser,
    getFavorites,
    addFavorite,
    removeFavorite
} from '../controllers/usersController.js';

// ===================== USERS =====================
 router.get('/:idUsers', getUserbytz);
router.post('/', validateJoiSchema(validUser.register), addUser);
router.post('/login', validateJoiSchema(validUser.login), loginUser);

// ===================== FAVORITES =====================
router.get('/:id/favorites', getFavorites);          
router.post('/:id/favorites/:cabinId', addFavorite); 
router.delete('/:id/favorites/:cabinId', removeFavorite);

export default router;
