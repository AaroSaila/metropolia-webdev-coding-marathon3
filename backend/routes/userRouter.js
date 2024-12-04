import express from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userControllers.js";


const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);


export default router;
