import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { getOrCreateMovie } from "../utils/movie.utils.js";
import "../models/movie.model.js";

jest.mock("../utils/movie.utils.js");

describe("History API - Watched Movies", () => {
  let user1Token;
  let user2Token;

  beforeAll(async () => {
    // Create User 1
    await request(app).post("/api/v1/auth/sign-up").send({
      firstName: "Test",
      lastName: "User1",
      email: "test1@test.com",
      password: "123456",
      dob: "2000-01-01",
      gender: "Male",
    });

    // Create User 2
    await request(app).post("/api/v1/auth/sign-up").send({
      firstName: "Test",
      lastName: "User2",
      email: "test2@test.com",
      password: "123456",
      dob: "2000-01-01",
      gender: "Male",
    });

    // Login User 1
    const login1 = await request(app)
      .post("/api/v1/auth/sign-in")
      .send({
        email: "test1@test.com",
        password: "123456",
      });

    user1Token = login1.body.data.token;

    // Login User 2
    const login2 = await request(app)
      .post("/api/v1/auth/sign-in")
      .send({
        email: "test2@test.com",
        password: "123456",
      });

    user2Token = login2.body.data.token;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // ADD MOVIE
  // -------------------------
  test("POST /history - should add movie", async () => {
    getOrCreateMovie.mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      title: "Fight Club",
    });

    const res = await request(app)
      .post("/api/v1/history")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ title: "Fight Club" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // -------------------------
  // GET OWN HISTORY
  // -------------------------
  test("GET /history - should return user's watched movies", async () => {
    getOrCreateMovie.mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      title: "Inception",
    });

    // First create movie
    await request(app)
      .post("/api/v1/history")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ title: "Inception" });

    // Then fetch
    const res = await request(app)
      .get("/api/v1/history")
      .set("Authorization", `Bearer ${user1Token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

//   // -------------------------
//   // UPDATE MOVIE
//   // -------------------------
  test("PUT /history/movie/:movieId - should update rating", async () => {
    getOrCreateMovie.mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      title: "Interstellar",
    });

    // Create movie first
    const addRes = await request(app)
      .post("/api/v1/history")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ title: "Interstellar" });

    const movieId = addRes.body.data._id;

    const res = await request(app)
      .put(`/api/v1/history/movie/${movieId}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ rating: 8 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // -------------------------
  // DELETE MOVIE
  // -------------------------
  test("DELETE /history/movie/:movieId - should remove movie", async () => {
    getOrCreateMovie.mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      title: "Dune",
    });

    // Create movie first
    const addRes = await request(app)
      .post("/api/v1/history")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ title: "Dune" });

    const movieId = addRes.body.data._id;

    const res = await request(app)
      .delete(`/api/v1/history/movie/${movieId}`)
      .set("Authorization", `Bearer ${user1Token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

//   // -------------------------
//   // UNAUTHORIZED TEST
//   // -------------------------
//   test("POST /history - should fail without token", async () => {
//     const res = await request(app)
//       .post("/api/v1/history")
//       .send({ title: "Fight Club" });

//     expect(res.statusCode).toBe(401);
//   });

//   // -------------------------
//   // PUBLIC USER HISTORY
//   // -------------------------
//   test("GET /history/:userId - should return public history", async () => {
//     const res = await request(app)
//       .get(`/api/v1/history/${mongoose.Types.ObjectId()}`)
//       .set("Authorization", `Bearer ${user1Token}`);

//     expect([200, 404]).toContain(res.statusCode);
//   });
});