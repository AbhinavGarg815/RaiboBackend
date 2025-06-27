import express from 'express';
import { trackInteraction } from '../controllers/interaction.controller.js';
import { jobType } from '../constants.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = express.Router();

router.post('/track', jwtAuthenticator, trackInteraction);

export default router;
