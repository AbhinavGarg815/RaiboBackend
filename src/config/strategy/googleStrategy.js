import GoogleStrategy from "passport-google-oauth20";
import {User} from "../../models/user.model.js";



const googleLogin =  new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {

            const user = await User.findOne({ googleId: profile.id });

            if (user) {
                console.log(user);
                done(null, user);
            } else {
                console.log("User Not Found");
                const newUser = new User({
                    googleId: profile.id,
                    fullname: profile.displayName,
                    email: profile.emails[0].value,
                });
                console.log(newUser);
                await newUser.save();
                done(null, newUser);
            }
        } catch (error) {
            console.error("Error in Google Strategy:", error);
            done(error, null);
        }
    },
);

export {googleLogin}
