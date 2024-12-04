import User from "../models/userModel.js";
import mongoose from "mongoose";

//GET / users;
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
};

// POST /users
export const createUser = async (req, res) => {
    try {
        const newUser = await User.create({ ...req.body });
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res
            .status(400)
            .json({ message: "Failed to create user", error: error.message });
    }
};

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

// PUT /users/:userId
export const updateUser = async (req, res) => {
    const { userId } = req.params;

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
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update user" });
    }
};

// DELETE /users/:userId
export const deleteUser = async (req, res) => {
    const { userId } = req.params;

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
