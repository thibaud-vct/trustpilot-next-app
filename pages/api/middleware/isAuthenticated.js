import connectDB from "../api/middleware/mongodb";

// import models
import User from "../api/models/user";

const isAuthenticated = async (authorization) => {
    try {
        if (authorization) {
            const token = authorization.replace("Bearer ", "");
            const user = await User.findOne({ token: token }).select(
                "email user company token"
            );

            if (user) {
                return user;
            } else {
                res.status(401).json({ message: "unauthorized" });
            }
        } else {
            res.status(401).json({ message: "unauthorized" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default connectDB(isAuthenticated);
