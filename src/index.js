import express from "express";
import routes from "./routes/index.js";
import { connectDB } from "./models/index.js";
import passport from "passport";
import "dotenv/config";
import bodyParser from "body-parser";

import passportSetup from "./config/passport.js";
const app = express();

app.use(passport.initialize());
passportSetup();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes.apiRoutes);
app.use("/testing", routes.testRoutes);

const port = process.env.port || 3000;

connectDB();

app.listen(port, () => console.log(`Server Runinng on port ${port}`));
