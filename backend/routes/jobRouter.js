import express from "express";
import { getAllJobs, getJobById, createJob, updateJob, deleteJob } from "../controllers/jobControllers.js";
import requireAuth from "../middleware/requireAuth.js";


const router = express.Router();

router.get("/", getAllJobs);
router.post("/", requireAuth, createJob);
router.get("/:jobId", requireAuth, getJobById);
router.put("/:jobId", requireAuth, updateJob);
router.delete("/:jobId", requireAuth, deleteJob);


export default router;
