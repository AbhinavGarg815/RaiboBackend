import { Router } from 'express';
import {
    createBoard,
    getBoards,
    getBoardById,
    updateBoard,
    deleteBoard,
    addProductToBoard,
    removeProductFromBoard,
 createBoardInvite,
    acceptBoardInvite,
    declineBoardInvite
} from '../controllers/board.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = Router();


router.get('/',jwtAuthenticator,getBoards);
router.post('/',jwtAuthenticator,createBoard);
router.get('/:boardId',jwtAuthenticator, getBoardById);
router.put('/:boardId',jwtAuthenticator, updateBoard);
router.delete('/:boardId',jwtAuthenticator, deleteBoard);

router.post('/addProduct/:boardId/:productId', jwtAuthenticator, addProductToBoard);
router.delete('/removeProduct/:boardId/:productId', jwtAuthenticator, removeProductFromBoard);

router.route('/:boardId/invites').post(createBoardInvite);
router.route('/invites/:inviteId/accept').post(acceptBoardInvite);
router.route('/invites/:inviteId/decline').post(declineBoardInvite);

export default router;