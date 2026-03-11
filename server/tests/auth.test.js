import request from "supertest";
import app from "../app.js";

describe("Auth API - Sign Up / Login / Logout", () => {

    let token; // to store JWT after login

    test("POST /sign-up should create a new user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/sign-up")
            .send({
                firstName: "Test",
                lastName: "User",
                email: "test@test.com",
                password: "123456",
                dob: "2000-01-01",
                gender: "Male"
            });

        expect(res.statusCode).toBe(201);
    });

    test("POST /sign-in should log in the user and return a token", async () => {
        const res = await request(app)
            .post("/api/v1/auth/sign-in")
            .send({
                email: "test@test.com",
                password: "123456"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("token");
        token = res.body.data.token; // store JWT for logout test
    });

    // test("POST /logout should log out the user", async () => {
    //     const res = await request(app)
    //         .post("/api/v1/auth/logout")
    //         .set("Authorization", `Bearer ${token}`);

    //     expect(res.statusCode).toBe(200);
    // });

});