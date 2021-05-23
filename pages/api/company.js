import connectDB from "../api/middleware/mongodb";

// import models
import User from "../api/models/user";
import Company from "../api/models/Company";
import Review from "../api/models/Review";

const handler = async (req, res) => {
    const { email, companyName, website, description } = req.body;
    try {
        // COMPANIES ROUTE ---
        if (req.method === "GET") {
            const allCompany = await Company.find();
            res.status(200).json({ data: allCompany });
            // NEW COMPANY ROUTE ---
        } else if (req.method === "POST") {
            if (email && companyName && website) {
                // find already
                const company = await Company.findOne({
                    website: website,
                });
                const userManager = await User.findOne({
                    email: email,
                });
                // email pro valid
                const validEmail = email.split("@");

                if (!company && website === validEmail[1]) {
                    // edit new company
                    const newCompany = new Company({
                        website: website,
                        name: companyName,
                        logoImageURL: "url à remplir",
                        description: description,
                    });

                    await newCompany.save();

                    // assiciate user manager
                    if (!userManager) {
                        const newUser = await new User({
                            email: email,
                            company: newCompany._id,
                        });
                        await newUser.save();
                    } else {
                        userManager.company = newCompany._id;
                        await userManager.save();
                    }

                    //response
                    res.status(200).json(newCompany);
                } else {
                    res.status(400).json({ message: "email invalid" });
                }
            } else {
                res.status(400).json({ message: "missing field" });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default connectDB(handler);
