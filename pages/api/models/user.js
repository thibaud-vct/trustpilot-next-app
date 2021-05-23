// https://dev.to/raphaelchaula/adding-mongodb-mongoose-to-next-js-apis-3af
import mongoose from "mongoose";

mongoose.models = {};

const User = mongoose.model("User", {
    email: { unique: true, type: String },
    user: {
        firstName: String,
        lastName: String,
        avatarImageURL: String,
        reviews: [mongoose.Schema.Types.ObjectId],
    },
    company: mongoose.Schema.Types.ObjectId,
    token: String,
    hash: String,
    salt: String,
});

export default User;
