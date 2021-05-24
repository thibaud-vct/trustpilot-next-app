import connectDB from "./middleware/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

// middleware encoding
import uid2 from "uid2";
import SHA256 from "crypto-js/sha256";
import encBase64 from "crypto-js/enc-base64";

// import models
import User from "./models/user";
import Company from "./models/company";
import Review from "./models/review";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        // SIGNUP ROUTE ---
        if (req.method === "POST") {
            if (email && password && firstName) {
                // find already
                const user = await User.findOne({ email: email });

                // Fonction to create hash password and token
                const passwordHash = (password) => {
                    const salt = uid2(64);
                    const hash = SHA256(password + salt).toString(encBase64);
                    const token = uid2(64);
                    return { salt: salt, hash: hash, token: token };
                };

                if (!user) {
                    const { salt, hash, token } = passwordHash(password);
                    // create new user
                    const newUser = await new User({
                        email: email,
                        user: {
                            firstName: firstName,
                            lastName: lastName,
                            avatarImageURL: "url à remplir",
                        },
                        salt: salt,
                        hash: hash,
                        token: token,
                    });

                    await newUser.save();

                    // response
                    res.status(200).json({
                        id: newUser._id,
                        email: newUser.email,
                        user: newUser.user,
                        token: newUser.token,
                    });
                } else if (user && !user.token) {
                    const { salt, hash, token } = passwordHash(password);

                    // edit user manage login
                    user.user.firstName = firstName;
                    user.user.lastName = lastName;
                    user.user.avatarImageURL = "url à remplir";
                    user.salt = salt;
                    user.hash = hash;
                    user.token = token;

                    await user.save();
                    // response
                    res.status(200).json({
                        id: user._id,
                        email: user.email,
                        user: user.user,
                        token: user.token,
                    });
                } else {
                    res.status(400).json({ message: "used by an account" });
                }
            } else {
                res.status(400).json({ message: "missing field" });
            }
            // LOGIN ROUTE ---
        } else if (req.method === "GET") {
            console.log(email, password);
            if (email && password) {
                // find if already
                const user = await User.findOne({ email: email });

                if (user) {
                    // rebuid hash
                    const hash = SHA256(password + user.salt).toString(
                        encBase64
                    );
                    // check and response
                    if (hash === user.hash) {
                        res.status(200).json({
                            id: user._id,
                            email: user.email,
                            user: user.user,
                            token: user.token,
                        });
                    } else {
                        res.status(400).json({ message: "login invalid" });
                    }
                } else {
                    res.status(400).json({ message: "login invalid" });
                }
            } else {
                res.status(400).json({ message: "login invalid" });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default connectDB(handler);
