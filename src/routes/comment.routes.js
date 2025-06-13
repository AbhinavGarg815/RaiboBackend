import { Router } from 'express';
import {
    createComment,
    getCommentsByReference,
    replyToComment,
    deleteComment,
    getInternalCommentsByReference
} from '../controllers/comment.controller.js';
import {jwtAuthenticator} from '../middlewares/passport.middleware.js';

const router = Router();
// Create a new comment
router.post('/', jwtAuthenticator, createComment);
router.get('/:referenceId',jwtAuthenticator, getCommentsByReference);
router.post('/:commentId/reply',jwtAuthenticator, replyToComment);
router.delete('/:commentId',jwtAuthenticator, deleteComment);
router.get('/internal/:referenceId',jwtAuthenticator, getInternalCommentsByReference);


export default router;