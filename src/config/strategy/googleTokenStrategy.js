import { Strategy as GoogleTokenStrategy } from "passport-google-verify-token";
import { User } from "../../models/user.model.js";
import { Company } from "../../models/company.model.js";


const googleTokenLogin = new GoogleTokenStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        // Add additional client IDs if needed
        // audience: [process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_ID_MOBILE]
    },
    async (parsedToken, googleId, done) => {
        const data = JSON.parse(parsedToken.body);
        try {
            // Find user by Google ID or email
            if (!data || !data.sub || !data.email) {
                console.error("Invalid token received:", data);
                return done(new Error("Invalid token"), null);
            }
            let user = await User.findOne({
                $or: [
                    { googleId: data.sub },
                    { email: data.email }
                ]
            });

            if (user) {
                console.log("Existing user found:", user.email);
                return done(null, user, {newUser : false});
            }

            // Create new user if not found
            const newUser = new User({
                googleId: data.sub,
                fullname: data.name,
                email: data.email,
                isVerified: data.email_verified,
            });

            await newUser.save();
            console.log("New user created:", newUser.email);
            return done(null, newUser,  {newUser : true});

        } catch (error) {
            console.error("Error in Google Token Strategy:", error);
            return done(error, null);
        }
    }
);

export { googleTokenLogin };