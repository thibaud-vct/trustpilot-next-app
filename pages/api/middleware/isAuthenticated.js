import connectDB from "../middleware/mongodb";

// import models
import User from "../models/user";

const isAuthenticated = async (authorization) => {
    try {
        if (authorization) {
            const token = authorization.replace("Bearer ", "");
            const user = await User.findOne({ token: token }).select(
                "email user company token _id"
            );

            if (user) {
                return user;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    } catch (error) {
        console.log(error.message);
        return undefined;
    }
};

export default connectDB(isAuthenticated);
