import request from "supertest";
import app from "../app.js";

describe("User API - User Profile", () => {
    let token, testUserId;

    // Sign up and log in to get a token for authorized requests
    beforeAll(async () => {
        await request(app)
            .post("/api/v1/auth/sign-up")
            .send({
                firstName: "Test",
                lastName: "User1",
                email: "test1@test.com",
                password: "123456",
                dob: "2000-01-01",
                gender: "Male"
            });

        const testUser2 = await request(app)
            .post("/api/v1/auth/sign-up")
            .send({
                firstName: "Test",
                lastName: "User2",
                email: "test2@test.com",
                password: "123456",
                dob: "2000-01-01",
                gender: "Male"
            });

        testUserId = testUser2.body.data.user._id;

        const res = await request(app)
            .post("/api/v1/auth/sign-in")
            .send({
                email: "test1@test.com",
                password: "123456"
            });

        token = res.body.data.token; // store JWT for logout test
    });


    // Authorized requests
    test("GET /me should return authorized user data", async () => {
        const res = await request(app)
            .get("/api/v1/user/me")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toBeDefined();
    });

    test("PUT /me should update authorized user data", async () => {
        const res = await request(app)
            .put("/api/v1/user/me")
            .set("Authorization", `Bearer ${token}`)
            .send({
                about: "Cinephile"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.about).toBe("Cinephile");
    });

    test("PUT /me should not allow updating email", async () => {
        const res = await request(app)
            .put("/api/v1/user/me")
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: "newemail@test.com"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.email).not.toBe("newemail@test.com");
    });

    // Should fail without token
    test("PUT /me should return 401 without token", async () => {
        const res = await request(app)
            .put("/api/v1/user/me")
            .send({
                about: "Hacker"
            });

        expect(res.statusCode).toBe(401);
    });

    // Should fail with invalid token
    test("PUT /me should return 401 with invalid token", async () => {
        const res = await request(app)
            .put("/api/v1/user/me")
            .set("Authorization", `Bearer invalid-token`)
            .send({
                about: "Hacker"
            });

        expect(res.statusCode).toBe(401);
    });

    test("GET /user/:userId should return user profile data", async () => {
        const res = await request(app)
            .get(`/api/v1/user/${testUserId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toBeDefined();
    });
});