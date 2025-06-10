import passport from "passport";


const jwtAuthenticator = passport.authenticate("jwt", { session: false });

const googleAuthenticator = passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    accessType: "offline",
    prompt: "select_account"
});


const googleCallbackAuthenticator = (req, res, next) => {
  const isDirectAuth = req.path === '/login/google-auth';
  console.log("Google Callback Authenticator called. Is direct auth:", isDirectAuth);
  // console.log("Request", req)
  if (isDirectAuth ) {
    // For direct authentication with access token
    passport.authenticate('google-token', { session: false }, (err, user, info) => {
      if (err) {
        console.error("Google authentication error:", err.message);
        return res.status(500).json({ error: "Authentication failed. Please try again." });
      }

      if (!user) {
        console.warn("Authentication failed:", info?.message || "Unknown reason");
        return res.status(401).json({ error: "Authentication failed" });
      }

      req.user = user;
      console.log("User authenticated successfully:", user);
      next();
    })(req, res, next);
  }
   else {
    // For regular OAuth callback
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) {
        console.error("Google authentication error:", err.message);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`)
      }

      if (!user) {
        console.warn("Authentication failed:", info?.message || "Unknown reason");
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
      }

      req.user = user;
      console.log("User authenticated successfully:", user);
      next();
    })(req, res, next);
  }
};


export { jwtAuthenticator, googleAuthenticator, googleCallbackAuthenticator };
