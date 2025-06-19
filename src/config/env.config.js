import dotenv from 'dotenv';
//separate file to ensure environment vairables are loaded first

let  path ='./.env';

if(process.env.NODE_ENV === 'production') { //Change the env path if running in prod
    path = '/secrets/env';
}

const {error} =  dotenv.config({path});
if(error) {
   console.error('ERROR: env file not found');
   process.exit(); // Exit the process completely.
}
