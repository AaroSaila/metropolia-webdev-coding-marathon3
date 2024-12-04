import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
const api = supertest(app);
import Job from "../models/jobModel.js";

const jobs = [
  {
    title:"Job title",
    type:"Remote job",
    description:"A very good job",
    company: {
      name:"Best company",
      contactEmail:"email@email.com",
      contactPhone:"12345",
      website:"www.website.com"
    },
    location:"Street 11",
    salary:5000,
    postedDate:new Date(),
    status:"open",
    applicationDeadline:new Date(),
    requirements:["Be a human", "Know what to do"]
  },
  {
    title:"Another job",
    type:"Company job",
    description:"Available for new graduates",
    company: {
      name:"Company company",
      contactEmail:"testing@email.com",
      contactPhone:"12345",
      website:"www.testsite.com"
    },
    location:"Street 11",
    salary:2500,
    postedDate:new Date(),
    status:"open",
    applicationDeadline:new Date(),
    requirements:["Be a human", "Know what to do"]
  }
];

describe("Job Controller", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Job.insertMany(jobs);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  // Test GET /api/jobs
  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
  });

  // Test POST /api/jobs
  it("should create a new job when POST /api/jobs is called", async () => {
    const newjob = {
    title:"Another job",
    type:"Company job",
    description:"Available for new graduates",
    company: {
      name:"Company company",
      contactEmail:"testing@email.com",
      contactPhone:"12345",
      website:"www.testsite.com"
    },
    location:"Street 11",
    salary:2500,
    postedDate:new Date(),
    status:"open",
    applicationDeadline:new Date(),
    requirements:["Be a human", "Know what to do"]
  }

    await api
      .post("/api/jobs")
      .send(newjob)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
    const jobTitles = jobsAfterPost.map((job) => job.title);
    expect(jobTitles).toContain(newjob.title);
  });

  // Test GET /api/jobs/:id
  it("should return one job by ID when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get(`/api/jobs/${job._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing job ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/jobs/${nonExistentId}`).expect(404);
  });

  // Test PUT /api/jobs/:id
  it("should update one job with partial data when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated description",
      type: "Contract",
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.description).toBe(updatedJob.description);
    expect(updatedJobCheck.type).toBe(updatedJob.type);
  });

  it("should return 400 for invalid job ID when PUT /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.put(`/api/jobs/${invalidId}`).send({}).expect(400);
  });

  // Test DELETE /api/jobs/:id
  it("should delete one job by ID when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api.delete(`/api/jobs/${job._id}`).expect(204);

    const deletedJobCheck = await Job.findById(job._id);
    expect(deletedJobCheck).toBeNull();
  });

  it("should return 400 for invalid job ID when DELETE /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.delete(`/api/jobs/${invalidId}`).expect(400);
  });
});
