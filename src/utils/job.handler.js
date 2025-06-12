import { Job } from '../models/notif.model.js';
const enqueJob =  async function(recievers, task, channel,values){

    try{
    const job = new Job({
        recievers,
        channel,
        task,
        values
    });

    await job.save();
    }
    catch(error)
    {
        console.error("Error queuing job:", error);
    }
}

export {enqueJob};
