import mongoose , {Schema} from "mongoose";
import {jobType} from '../constants.js';

const jobSchema = new Schema({
    recievers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    task: {
        type: String,
        enum: jobType,
        required: true
    },
    channel:{
        type: String,
        enum: ['email', 'sms', 'push'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing','sent', 'failed'],
        default: 'pending'
    },
    values: {
        type: Map,
        of: String,
        default: {}
    },

}, {timestamps: true});

export const Job = mongoose.model('Jobs', jobSchema);
