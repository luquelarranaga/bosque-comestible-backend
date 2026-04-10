const db = require("../../db/connection");
const data = require("../../db/data/test_data/plants");
const seed = require("../../db/seeds/seed");
const request = require("supertest");
const app = require("../../app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/plants/", () => {
  describe("GET 200", () => {
    test("responds with an object with a key of plants with a value of an array of objects", async () => {
      const { body } = await request(app).get("/api/plants/").expect(200);
      console.log("body>>>", body);
      expect(body).toBeObject();
      expect(body.plants).toBeArray();
      // .catch(err);
    });
  });
});
