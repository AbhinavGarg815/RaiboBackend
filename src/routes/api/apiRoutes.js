import {Router} from 'express';
import {signUp} from '../../controllers/usersManager.js';
import {signUpValidator} from '../../config/validator.js';



const router = Router();

router.post('/signUp', signUpValidator,  signUp);


export default router;
