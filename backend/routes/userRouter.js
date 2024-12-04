import express from "express";
import { getAllUsers, getUserById, signupUser, loginUser, updateUser, deleteUser } from "../controllers/userControllers.js";
import requireAuth from "../middleware/requireAuth.js";


const router = express.Router();

router.get("/", getAllUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/:userId", getUserById);
router.put("/", requireAuth, updateUser);
router.delete("/", requireAuth, deleteUser);


export default router;
