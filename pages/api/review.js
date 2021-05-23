import connectDB from "../api/middleware/mongodb";

// import models
import User from "../api/models/user";
import Company from "../api/models/Company";
import Review from "../api/models/Review";

const handler = async (req, res) => {
    const user = isAuthenticated(req.header.authorization);
    const { email, companyName, website, description } = req.body;
    try {
        // REVIEW ROUTE ---
        if (req.method === "POST") {
            // find company
            const company = await Company.findOne({
                _id: req.fields.companyId,
            });
            // add review
            const newReview = await new Review({
                company: company._id,
                user: req.user._id,
                score: req.fields.score,
                review: req.fields.review,
                reviewDate: Date.now(),
            });
            await newReview.save();
            company.reviews.push(newReview._id);
            await company.save();
            req.user.user.reviews.push(newReview._id);
            await req.user.save();
            // response
            res.status(200).json({ message: "success" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default connectDB(handler);
