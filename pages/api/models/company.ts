import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";

export interface ICompany extends Document {
    website: string;
    name: string;
    logoImageURL: string;
    description: string;
    score: number;
    reviews: IUser["_id"];
}

const UserSchema: Schema = new Schema({
    website: { type: String, required: true, unique: true },
    name: String,
    logoImageURL: String,
    description: String,
    score: Number,
    reviews: [mongoose.Schema.Types.ObjectId],
});

export default mongoose.model<ICompany>("Company", UserSchema);
