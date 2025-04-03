import { Router } from "express";
import { signUp, login, profile } from "../../controllers/usersManager.js";
import { signUpValidator, loginValidator } from "../../config/validator.js";
import passport from "passport";

const router = Router();

router.post("/signUp", signUpValidator, signUp);
router.post("/login", loginValidator, login);
router.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: process.env.REDIR_URL, //TODO: Fill Proper Redirect URL
  }),
  profile,
);

export default router;
