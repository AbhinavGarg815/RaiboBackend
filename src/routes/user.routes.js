import { Router } from "express";
import { getAllUsers, updateUser } from "../controllers/user.controller.js";
import { jwtAuthenticator } from "../middlewares/passport.middleware.js";

const router = Router();

router.get("/", jwtAuthenticator, getAllUsers);
router.put("/", jwtAuthenticator, updateUser);

export default router;