import './config/env.config.js'; //ensure config is loaded first

import connectDB from "./db/index.js";
import {connectCloudinary} from "./config/cloudinary.config.js";
import app from "./app.js";


app.get("/", (req, res) => {
    res.send("Raibo backend");
})

connectCloudinary();
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
