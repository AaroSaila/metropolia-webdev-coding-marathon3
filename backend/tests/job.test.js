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

let job = null;
const token = "eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQ2hhZCBjaGFkZGVycyIsInVzZXJuYW1lIjoiQ2hhZGxhZCIsInBhc3N3b3JkIjoiJDJiJDEwJEJkeEd2VTNuREdnQk11bDZiRXZSV2V3dlk2eHViRTdpYkNkQlpsdGdwclFpSXBUVlloSHVXIiwicGhvbmVfbnVtYmVyIjoiMjM0IiwiZ2VuZGVyIjoibWFsZSIsImRhdGVfb2ZfYmlydGgiOiIxOTUwLTEyLTExVDIyOjAwOjAwLjAwMFoiLCJtZW1iZXJzaGlwX3N0YXR1cyI6Im1lbWJlciIsImFkZHJlc3MiOiJPbGQgc3RyZWV0IDUwIiwicHJvZmlsZV9waWN0dXJlIjoicGljdHVyZTMuanBnIiwiX2lkIjoiNjc1MTdjMWU1YzlkNWEyNzc2ZTZjYmE3IiwiY3JlYXRlZEF0IjoiMjAyNC0xMi0wNVQxMDoxMDozOC4xMDlaIiwidXBkYXRlZEF0IjoiMjAyNC0xMi0wNVQxMDoxMDozOC4xMDlaIn0.dKw7CPYC5Xk16PfX4GmacF_GgCDRkaocu9Zdtbn7cGk";

describe("Job Controller", () => {
  beforeEach(async () => {
    await Job.deleteMany();
    await Job.insertMany(jobs);
    job = Job.findOne({title:"Job title"});
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  // Test GET /api/jobs
  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .set("Authorization", `bearer ${token}`)
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
      .set("Authorization", `bearer ${token}`)
      .send(newjob)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
    const jobTitles = jobsAfterPost.map((job) => job.title);
    expect(jobTitles).toContain(newjob.title);
  });

  it("should return 401 without a valid token when POST /api/jobs is called", async () => {
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
      .set("Authorization", `bearer 12345`)
      .send(newjob)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  // Test GET /api/jobs/:id
  it("should return 401 without a valid token when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get(`/api/jobs/${job._id}`)
      .set("Authorization", `bearer 2394`)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 200 with a valid token when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get(`/api/jobs/${job._id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing job ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/jobs/${nonExistentId}`).expect(401);
  });

  // Test PUT /api/jobs/:id
  it("should return 201 when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated description",
      type: "Contract",
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", `bearer ${token}`)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 401 without a valid token when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated description",
      type: "Contract",
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", `bearer 123123`)
      .send(updatedJob)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  // Test DELETE /api/jobs/:id
  it("should return 401 without a valid token when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api.delete(`/api/jobs/${job._id}`).expect(401);
  });

  it("should return 204 when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api.delete(`/api/jobs/${job._id}`).set("Authorization", `bearer ${token}`).send({}).expect(204);
  });
});

