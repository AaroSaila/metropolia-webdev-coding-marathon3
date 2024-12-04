import supertest from "supertest";
import mongoose from "mongoose"
import app from "../app.js"
const api = supertest(app);
import User from "../models/userModel.js"

const users = [
    {
        name:"Bob Bobbers",
        username:"Bobthebobber",
        password:"Password123!",
        phone_number:"12345",
        gender:"male",
        date_of_birth:new Date(),
        membership_status:"member",
        address:"Street 12",
        profile_picture:"picture.jpg"
    },
    {
        name:"Mike Mikers",
        username:"Miketheman",
        password:"Letmepass123!",
        phone_number:"5555",
        gender:"male",
        date_of_birth:new Date(),
        membership_status:"member",
        address:"Old street 50",
        profile_picture:"picture2.jpg"
    }
]

let testuser = null;

describe("User Controller", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(users);
    testuser = await User.findOne({name:"Bob Bobbers"});
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  // Test GET /api/users/:id
  it("should return a user as JSON when GET /api/user is called", async () => {
    const response = await api
      .get(`/api/users/${testuser._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.name).toBe("Bob Bobbers");
  });

  // Test POST /api/users
  it("should create a new user when POST /api/jobs is called", async () => {
    const newuser = {
        name:"Chad chadders",
        username:"Chadlad",
        password:"Thisisapass222!",
        phone_number:"234",
        gender:"male",
        date_of_birth:"12.12.1950",
        membership_status:"member",
        address:"Old street 50",
        profile_picture:"picture3.jpg"
    }

    await api
      .post("/api/users")
      .send(newuser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing user ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/users/${nonExistentId}`).expect(404);
  });

  // Test PUT /api/users/:id
  it("should update one user with partial data when PUT /api/users/:id is called", async () => {
    const updatedUser = {
      name: "Not the old name",
      address: "Some random address",
    };

    await api
      .put(`/api/users/${testuser._id}`)
      .send(updatedUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedUserCheck = await User.findById(testuser._id);
    expect(updatedUserCheck.name).toBe(updatedUser.name);
    expect(updatedUserCheck.address).toBe(updatedUser.address);
  });

  it("should return 400 for invalid user ID when PUT /api/users/:id", async () => {
    const invalidId = "12345";
    await api.put(`/api/users/${invalidId}`).send({}).expect(400);
  });

  // Test DELETE /api/users/:id
  it("should delete one job by ID when DELETE /api/users/:id is called", async () => {
    await api.delete(`/api/users/${testuser._id}`).expect(204);

    const deletedUserCheck = await User.findById(testuser._id);
    expect(deletedUserCheck).toBeNull();
  });

  it("should return 400 for invalid user ID when DELETE /api/users/:id", async () => {
    const invalidId = "12345";
    await api.delete(`/api/jobs/${invalidId}`).expect(400);
  });
});
