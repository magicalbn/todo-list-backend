const mongoose = require("mongoose");
const request = require("supertest");
const TodoSchema = require("../models/todo-list-model");

const app = require("../app");
require("dotenv").config();

beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe("GET /todo/list", () => {
    it("should return first 10 todo items", async () => {
        const res = await request(app).get("/todo/list");
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should return 5 todo items", async () => {
        const res = await request(app).get("/todo/list?limit=5");
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(5);
    });
});

describe("POST /todo/create", () => {
    it("should create a todo item", async () => {
        const res = await request(app).post("/todo/create").send({
            title: "New Todo",
            description: "Description for Todo",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toBe("resource created");
    });

    it("should terminate with a failure response", async () => {
        const res = await request(app).post("/todo/create").send({
            title: "New Todo",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error.length).toBeGreaterThan(0);
    });
});

describe("DELETE /todo/delete/:id", () => {
    it("should delete a product", async () => {
        const recentItem = await TodoSchema.findOne({}).sort({
            created_at: -1,
        });
        const id = recentItem._id;
        const res = await request(app).delete(`/todo/delete/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBe("resource deleted");
    });
});
