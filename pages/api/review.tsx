import connectDB from "../api/middleware/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import isAuthenticated from "../api/middleware/isAuthenticated";

// import models
import User from "../api/models/user";
import Company from "../api/models/company";
import Review from "../api/models/review";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const user = await isAuthenticated(req.headers.authorization);
        if (user) {
            const { company_id, score, review } = req.body;
            // REVIEW ROUTE ---
            if (req.method === "POST") {
                // find company
                const company = await Company.findOne({
                    _id: company_id,
                });
                // add review
                const newReview = await new Review({
                    company: company._id,
                    user: user._id,
                    score: score,
                    review: review,
                    reviewDate: Date.now(),
                });
                await newReview.save();
                company.reviews.push(newReview._id);
                await company.save();
                user.user.reviews.push(newReview._id);
                await user.save();
                // response
                res.status(200).json({ message: "success" });
            }
        } else {
            res.status(401).json({ message: "unauthorized" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default connectDB(handler);
