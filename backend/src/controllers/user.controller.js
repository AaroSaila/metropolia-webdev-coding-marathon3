import User from "../models/user.model.js";


export const createUser = async (req, res) => {
    try {
        const user = req.body;

        await User.create(user);

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }
};
