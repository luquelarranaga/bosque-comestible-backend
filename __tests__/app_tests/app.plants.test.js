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
    test("plants are ordered by species in alphabetical order", async () => {
      const { body } = await request(app).get("/api/plants/").expect(200);
      const { plants } = body;
      const species = plants.map((plant) => plant.species);
      expect(species).toBeSorted();
    });
    test("each plant species are ordered by date_planted", async () => {
      const { body } = await request(app).get("/api/plants/").expect(200);
      const { plants } = body;
      const lavenderPlants = plants.filter(
        (plant) => plant.species === "lavender",
      );
      const datePlanted = lavenderPlants.map((plant) => plant.date_planted);
      expect(datePlanted).toBeSorted({ descending: true });
    });
    test("plants are filtered by species specified in query", async () => {
      const { body } = await request(app)
        .get("/api/plants?species=lavender")
        .expect(200);
      const { plants } = body;
      plants.forEach((plant) => {
        expect(plant.species).toBe("lavender");
      });
    });
    test("when species queried, plants are ordered by date_planted", async () => {
      const { body } = await request(app)
        .get("/api/plants?species=lavender")
        .expect(200);
      const { plants } = body;
      const datePlanted = plants.map((plant) => plant.date_planted);
      expect(datePlanted).toBeSorted({ descending: true });
    });
  });
  describe("POST 201", () => {
    test("responds with a single object", async () => {
      const { body } = await request(app)
        .post("/api/plants/")
        .send({
          species: "lavender",
          date_planted: new Date(1609469200000),
          coordinates: "51.5474,-0.1300",
          body: "new plant",
          care: "this is how you care for me",
          img_url:
            "https://images.pexels.com/photos/207518/pexels-photo-207518.jpeg?w=700&h=700",
        })
        .expect(201);
      const { plant } = body;
      expect(plant).toBeObject();
      expect(plant).not.toBeArray();
    });
    test("object contains correct key properties", async () => {
      const { body } = await request(app)
        .post("/api/plants/")
        .send({
          species: "lavender",
          date_planted: new Date(1609469200000),
          coordinates: "51.5474,-0.1300",
          body: "new plant",
          care: "this is how you care for me",
          img_url:
            "https://images.pexels.com/photos/207518/pexels-photo-207518.jpeg?w=700&h=700",
        })
        .expect(201);
      const { plant } = body;
      expect(typeof plant.species).toBe("string");
      expect(typeof plant.date_planted).toBe("string");
      expect(typeof plant.coordinates).toBe("string");
      expect(typeof plant.body).toBe("string");
      expect(typeof plant.care).toBe("string");
      expect(typeof plant.img_url).toBe("string");
    });
  });
  describe("ERROR: INVALID METHOD 405", () => {
    test("returns 405 status code and error message when invalid method used", () => {
      const methods = ["put", "patch", "delete"];
      methods.forEach(async (method) => {
        const { body } = await request(app)[method]("/api/plants/").expect(405);
        expect(body.msg).toBe("Method not allowed");
      });
    });
  });
  describe("ERROR: INVALID INPUT 400", () => {
    test("returns 400 error when invalid species is queried", async () => {
      const { body } = await request(app)
        .get("/api/plants?species=123")
        .expect(400);
      expect(body.msg).toBe("Invalid species query");
    });
  });
  describe("ERROR: BAD REQUEST 404", () => {
    test("returns 404 error when valid species is queried but not found in the database", async () => {
      const { body } = await request(app)
        .get("/api/plants?species=cassava")
        .expect(404);
      expect(body.msg).toBe("Species not found");
    });
  });
});

describe("/api/plants/:plant_id", () => {
  describe("PATCH 200", () => {
    test("responds with the updated plant object", async () => {
      const { body } = await request(app)
        .patch("/api/plants/1")
        .send({
          body: "leaves are looking yellow",
        })
        .expect(200);

      const { plant } = body;
      expect(plant).toBeObject();
      expect(plant).not.toBeArray();
    });
    test("when one field updated, the updated field reflects the sent data", async () => {
      const updatedData = { body: "leaves are looking yellow" };
      const { body } = await request(app)
        .patch("/api/plants/3")
        .send(updatedData)
        .expect(200);
      const { plant } = body;
      expect(plant.body).toBe("leaves are looking yellow");
    });
    test("when multiple fields are updated, the updated fields reflect the sent data", async () => {
      const updatedData = {
        body: "leaves are looking yellow",
        img_url:
          "https://images.pexels.com/photos/1466869/pexels-photo-1466869.jpeg?w=700&h=700",
      };
      const { body } = await request(app)
        .patch("/api/plants/3")
        .send(updatedData)
        .expect(200);
      const { plant } = body;
      expect(plant.body).toBe(updatedData.body);
      expect(plant.img_url).toBe(updatedData.img_url);
    });
  });
});

describe("/api/invalid-path", () => {
  test("Invalid path returns 400 error", async () => {
    const { body } = await request(app).get("/api/invalid-path").expect(400);
    expect(body.msg).toBe("Bad request");
  });
});
