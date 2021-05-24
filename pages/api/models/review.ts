import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";
import { ICompany } from "./company";

export interface IReview extends Document {
    company: ICompany["_id"];
    user: IUser["_id"];
    score: number;
    review: string;
    reviewDate: Date;
    answer: string;
    answerDate: Date;
}

const ReviewSchema: Schema = new Schema({
    company: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId,
    score: Number,
    review: String,
    reviewDate: Date,
    answer: String,
    answerDate: Date,
});

export default mongoose.model("Review", ReviewSchema);
