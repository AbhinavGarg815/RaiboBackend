import { Router } from 'express';
import {
    createRoom,
    addProductToRoom,
    removeProductFromRoom,
    getUserRooms,
    deleteRoom
} from '../controllers/room.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = Router();

router.post('/', jwtAuthenticator, createRoom);
router.post('/product/:roomId', jwtAuthenticator, addProductToRoom);
router.delete('/product/:roomId', jwtAuthenticator, removeProductFromRoom);
router.get('/', jwtAuthenticator, getUserRooms);
router.delete('/:roomId', jwtAuthenticator, deleteRoom);

export default router;