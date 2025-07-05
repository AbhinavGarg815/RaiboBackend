import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { generateAlphanumericId } from "../utils/idGenerator.js";
import { DB_NAME } from "../constants.js";

const migrateProducts = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debugging line
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB connected for migration.");

        const products = await Product.find({ externalProductId: { $exists: false } });
        console.log(`Found ${products.length} products without externalProductId.`);

        for (const product of products) {
            product.externalProductId = generateAlphanumericId(10);
            await product.save();
            console.log(`Updated product ${product._id} with externalProductId: ${product.externalProductId}`);
        }

        console.log("Product migration completed successfully.");
    } catch (error) {
        console.error("Error during product migration:", error);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected.");
    }
};

migrateProducts();
