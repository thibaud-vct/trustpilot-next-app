// https://dev.to/raphaelchaula/adding-mongodb-mongoose-to-next-js-apis-3af
import mongoose, { Document, Schema } from "mongoose";
import { IReview } from "./review";
import { ICompany } from "./company";

export interface User extends Document {
    firstName: string;
    lastName: string;
    avatarImageURL: string;
    reviews: IReview["_id"];
}

export interface IUser extends Document {
    email: string;
    user?: User;
    company?: ICompany["_id"];
    token?: string;
    hash?: string;
    salt?: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, unique: true, required: true },
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

export default mongoose.model<IUser>("User", UserSchema);
