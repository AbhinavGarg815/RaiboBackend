import 'dotenv/config'
import mongoose from 'mongoose'
import User from './UserSchema.js'


const dbURL = process.env.MONGODB_URI;

const connectDB = async () => {

        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        mongoose.connection.once('open', () => {
          console.log('Connected to MongoDB');
        });
        return mongoose.connect(dbURL,);
}

export { connectDB}

const models = { User }
export default models
