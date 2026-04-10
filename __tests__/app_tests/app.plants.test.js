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

/*
plant.species,
      plant.date_planted,
      plant.coordinates,
      plant.body,
      plant.care,
      plant.img_url,
*/
describe("/api/plants/", () => {
  describe("GET 200", () => {
    test("responds with an object with a key of plants with a value of an array of objects", async () => {
      const { body } = await request(app).get("/api/plants/").expect(200);
      console.log("body>>>", body);
      expect(body).toBeObject();
      expect(body.plants).toBeArray();
    });
    test("each plant object contains correct keys", async () => {
      const { body } = await request(app).get("/api/plants/").expect(200);
      const { plants } = body;
      plants.forEach((plant) => {
        expect(typeof plant.species).toBe("string");
        expect(typeof plant.date_planted).toBe("string");
        expect(typeof plant.coordinates).toBe("string");
        expect(typeof plant.body).toBe("string");
        expect(typeof plant.care).toBe("string");
        expect(typeof plant.img_url).toBe("string");
      });
    });
  });
});
