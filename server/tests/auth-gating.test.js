import request from "supertest";
import { jest } from "@jest/globals";
import app from "../src/index.js";
import { User } from "../src/models/index.js";
import { generateToken } from "../src/utils/jwt.js";

describe("Authentication Gating Tests", () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Create a test user
    testUser = new User({
      email: "test@example.com",
      passwordHash: await User.hashPassword("testpassword123"),
    });
    await testUser.save();

    // Generate auth token
    authToken = generateToken(testUser._id);
  });

  afterAll(async () => {
    // Clean up
    await User.deleteOne({ _id: testUser._id });
  });

  describe("POST /api/shorten - Authentication Required", () => {
    test("should return 401 when no token provided", async () => {
      const response = await request(app)
        .post("/api/shorten")
        .send({ longUrl: "https://www.google.com" });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        ok: false,
        msg: "Please log in",
      });
    });

    test("should return 401 when invalid token provided", async () => {
      const response = await request(app)
        .post("/api/shorten")
        .set("Authorization", "Bearer invalid-token")
        .send({ longUrl: "https://www.google.com" });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        ok: false,
        msg: "Please log in",
      });
    });

    test("should successfully shorten URL when valid token provided", async () => {
      const response = await request(app)
        .post("/api/shorten")
        .set("Cookie", `auth_token=${authToken}`)
        .send({ longUrl: "https://www.google.com" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("shortUrl");
      expect(response.body).toHaveProperty("shortCode");
      expect(response.body.longUrl).toBe("https://www.google.com");
    });

    test("should validate URL format even with auth", async () => {
      const response = await request(app)
        .post("/api/shorten")
        .set("Cookie", `auth_token=${authToken}`)
        .send({ longUrl: "invalid-url" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /:shortCode - Public Access", () => {
    let shortCode;

    beforeAll(async () => {
      // Create a test link
      const response = await request(app)
        .post("/api/shorten")
        .set("Cookie", `auth_token=${authToken}`)
        .send({ longUrl: "https://www.example.com" });

      shortCode = response.body.shortCode;
    });

    test("should redirect without authentication", async () => {
      const response = await request(app).get(`/${shortCode}`).expect(302);

      expect(response.headers.location).toBe("https://www.example.com");
    });
  });

  describe("Protected Routes - User Scoped", () => {
    test("/api/links should require authentication", async () => {
      const response = await request(app).get("/api/links");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        ok: false,
        msg: "Please log in",
      });
    });

    test("/api/links should return only user's links", async () => {
      const response = await request(app)
        .get("/api/links")
        .set("Cookie", `auth_token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("links");
      expect(Array.isArray(response.body.links)).toBe(true);
    });
  });
});
