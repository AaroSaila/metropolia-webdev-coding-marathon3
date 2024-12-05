import User from "../models/userModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//GET / users;
export const getAllUsers = async (_, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
};

// POST /users/signup
export const signupUser = async (req, res) => {
    try {
        const newUser = await User.signup({ ...req.body });
        const token = jwt.sign(JSON.stringify(newUser), process.env.SECRET);
        res.status(201).json({ msg: "User created", token });
    } catch (error) {
        console.error(error);
        res
            .status(400)
            .json({ message: "Failed to create user", error: error.message });
    }
};

// POST /users/login/
export const loginUser = async (req, res) => {
    const { username, password } = req.query;

    const user = await User.findOne({username});

    if (user === null) {
        return res.status(400).json({error: `No user with username ${username}`});
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
        return res.status(401).json({error: "Incorrect password"});
    }

    const token = jwt.sign(JSON.stringify(user), process.env.SECRET);

    return res.status(200).json({ msg: "User logged in", token });
}

// GET /users/:userId
export const getUserById = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve user" });
    }
};

// PUT /users
export const updateUser = async (req, res) => {
    const userId = await req.user["_id"];

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { ...req.body },
            { new: true }
        );
        if (updatedUser) {
            res.status(200).json({msg: "User updated"});
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update user" });
    }
};

// DELETE /users/
export const deleteUser = async (req, res) => {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const deletedUser = await User.findOneAndDelete({ _id: userId });
        if (deletedUser) {
            res.status(204).send(); // 204 No Content
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};
