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
    declineBoardInvite,
    getBoardInvites,
    changeCollaboratorStatus
} from '../controllers/board.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = Router();

router.get('/', jwtAuthenticator, getBoards);
router.post('/', jwtAuthenticator, createBoard);

// Place the more specific /invites route before the generic /:boardId route
router.get('/invites', jwtAuthenticator, getBoardInvites);

router.get('/:boardId', jwtAuthenticator, getBoardById);
router.put('/:boardId', jwtAuthenticator, updateBoard);
router.delete('/:boardId', jwtAuthenticator, deleteBoard);

router.post('/addProduct/:boardId/:productId', jwtAuthenticator, addProductToBoard);
router.delete('/removeProduct/:boardId/:productId', jwtAuthenticator, removeProductFromBoard);

router.post('/invites/:boardId', jwtAuthenticator, createBoardInvite);
router.post('/invites/accept/:inviteId', jwtAuthenticator, acceptBoardInvite);
router.post('/invites/decline/:inviteId', jwtAuthenticator, declineBoardInvite);

router.put('/collaborators/:boardId', jwtAuthenticator, changeCollaboratorStatus);

export default router;