import dotenv from "dotenv";
import { connect } from "mongoose";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server running at port:", process.env.PORT || 8000);
    })
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
});