import passport from "passport";


const jwtAuthenticator = passport.authenticate("jwt", { session: false });

const googleAuthenticator = passport.authenticate("google", {accessType: "offline",
  scope: ["profile", "email"],
});


const googleCallbackAuthenticator = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Google authentication error:", err.message);
      return res.status(500).json({ error: "Authentication failed. Please try again." });
    }

    if (!user) {
      console.warn("Authentication failed:", info?.message || "Unknown reason");
      return res.redirect("/error");
    }

    req.user = user;
    next();
  })(req, res, next);
};

export { jwtAuthenticator, googleAuthenticator, googleCallbackAuthenticator };
