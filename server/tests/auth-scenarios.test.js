import request from "supertest";
import { app } from "../src/app.js";
import { connectDB, disconnectDB } from "../src/config/database.js";
import { User } from "../src/models/index.js";

describe("Authentication Scenarios", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean up users before each test
    await User.deleteMany({});
  });

  describe("Login Scenarios", () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const hashedPassword = await User.hashPassword("testpass123");
      await User.create({
        email: "test@example.com",
        passwordHash: hashedPassword,
      });
    });

    test("Account doesn't exist - should show specific message", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: "anypassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(
        "Account doesn't exist. Please sign up to continue."
      );
      expect(response.body.code).toBe("USER_NOT_FOUND");
    });

    test("Email not found (typo/wrong email) - should show specific message", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "typo@example.com",
        password: "testpass123",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(
        "Account doesn't exist. Please sign up to continue."
      );
      expect(response.body.code).toBe("USER_NOT_FOUND");
    });

    test("Correct email, wrong password - should show specific message", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Incorrect password.");
      expect(response.body.code).toBe("INVALID_PASSWORD");
    });

    test("Empty email - should show specific message", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "",
        password: "testpass123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please enter your email.");
    });

    test("Invalid email format - should show specific message", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "invalid-email",
        password: "testpass123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid email address.");
    });

    test("Empty password - should show specific message", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please enter your password.");
    });

    test("Successful login - should work correctly", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "testpass123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    test("Email normalization - should work with different cases and spaces", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "  TEST@EXAMPLE.COM  ",
        password: "testpass123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
    });
  });

  describe("Sign-up Scenarios", () => {
    test("Duplicate email - should show specific message", async () => {
      // First, create a user
      const hashedPassword = await User.hashPassword("testpass123");
      await User.create({
        email: "existing@example.com",
        passwordHash: hashedPassword,
      });

      // Try to create another user with same email
      const response = await request(app).post("/auth/signup").send({
        email: "existing@example.com",
        password: "newpass123",
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe(
        "An account with this email already exists. Try logging in."
      );
      expect(response.body.code).toBe("EMAIL_EXISTS");
    });

    test("Empty email on sign-up - should show specific message", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "",
        password: "testpass123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please enter your email.");
    });

    test("Invalid email format on sign-up - should show specific message", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "invalid-email",
        password: "testpass123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid email address.");
    });

    test("Empty password on sign-up - should show specific message", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "test@example.com",
        password: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please enter your password.");
    });

    test("Too short password on sign-up - should show specific message", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "test@example.com",
        password: "12345",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Password must be at least 6 characters."
      );
    });

    test("Successful sign-up - should work correctly", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "newuser@example.com",
        password: "testpass123",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Account created successfully.");
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe("newuser@example.com");
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    test("Email normalization on sign-up - should work with different cases and spaces", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "  NEWUSER@EXAMPLE.COM  ",
        password: "testpass123",
      });

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe("newuser@example.com");
    });
  });

  describe("Session Expired Scenarios", () => {
    test("Missing token - should show session expired message", async () => {
      const response = await request(app).get("/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe("Session expired. Please log in.");
    });

    test("Invalid token - should show session expired message", async () => {
      const response = await request(app)
        .get("/auth/me")
        .set("Cookie", "auth_token=invalid_token");

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe("Session expired. Please log in.");
    });
  });
});
