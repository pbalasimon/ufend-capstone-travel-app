const request = require("supertest");
import { app } from "../src/server/index";

describe("Test endpoints", () => {
  it("should return index page", async () => {
    const res = await request(app).get("/").send("./dist/index.html");
    expect(res.statusCode).toEqual(200);
  });
});
