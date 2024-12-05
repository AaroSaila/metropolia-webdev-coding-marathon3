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
        password:"Password123!",
        phone_number:"234",
        gender:"male",
        date_of_birth:"12.12.1950",
        membership_status:"member",
        address:"Old street 50",
        profile_picture:"picture3.jpg"
    }

    await api
      .post("/api/users/signup")
      .send(newuser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing user ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/users/${nonExistentId}`).expect(404);
  });

  it("should return 401 for invalid user token when PUT /api/users/", async () => {
    const user = {
        _id:"123"
    }
    await api.put(`/api/users/`).send(user).expect(401);
  });

  it("should return 401 for invalid user token when DELETE /api/users/", async () => {
    const user = {
        _id:"123"
    }
    await api.delete(`/api/users`).send(user).expect(401);
  });
});

