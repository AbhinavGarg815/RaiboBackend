import {Router} from 'express';
import models from '../../models/index.js';
import mongoose, { Types } from 'mongoose';


const ObjectId = Types.ObjectId;

const router = Router();

const db = mongoose.connection;

router.get('/', (req, res) => {
    res.send("Sup");
});

router.get('/testDB', (req,res) => {
    db.listCollections().then(collections => {

        console.log(collections);
        res.send(collections);
    })
});



export default router;
