import passport from "passport";


const jwtAuthenticator = passport.authenticate("jwt", { session: false });

const googleAuthenticator = passport.authenticate("google", {accessType: "offline",
  scope: ["profile", "email"],
});


const googleCallbackAuthenticator = passport.authenticate("google", {
  failureRedirect: "/error", session: false,
});

export { jwtAuthenticator, googleAuthenticator, googleCallbackAuthenticator };
