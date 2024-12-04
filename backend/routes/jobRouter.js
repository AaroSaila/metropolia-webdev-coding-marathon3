import express from "express";
import { getAllJobs, getJobById, createJob, updateJob, deleteJob } from "../controllers/jobControllers.js";


const router = express.Router();

router.get("/", getAllJobs);
router.post("/", createJob);
router.get("/:jobId", getJobById);
router.put("/:jobId", updateJob);
router.delete("/:jobId", deleteJob);


export default router;
