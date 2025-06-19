import { Job } from '../models/notif.model.js';
import { PubSub } from '@google-cloud/pubsub';

const enqueJob =  async function(recievers, task, channel,values){

    try{

    const projectId = process.env.GCLOUD_PROJECT_ID;
    const topicId = process.env.PUBSUB_TOPIC_ID;

    const pubsub = new PubSub({projectId});
    const job = new Job({
        recievers,
        channel,
        task,
        values
    });

    const savedJob = await job.save();
    const topic = pubsub.topic(topicId);

    const publishData = {jobId: savedJob._id.toString()};

    topic.publishMessage({data: Buffer.from(JSON.stringify(publishData))});
    console.log(`Job queued with ID: ${savedJob._id}`);

    }
    catch(error)
    {
        console.error("Error queuing job:", error);
    }
}

export {enqueJob};
