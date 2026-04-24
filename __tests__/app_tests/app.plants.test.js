const db = require("../../db/connection");
const data = require("../../db/data/test-data/index");
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
{ species: "lavender", coordinates: "51.5074,-0.1278", created_at:  },
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
        expect(typeof plant.coordinates).toBe("string");
        expect(typeof plant.created_at).toBe("string");
      });
    });
    test("plants are ordered by species in alphabetical order", async () => {
      const { body } = await request(app).get("/api/plants/").expect(200);
      const { plants } = body;
      const species = plants.map((plant) => plant.species);
      expect(species).toBeSorted();
    });
    test("each plant species are ordered by created_at", async () => {
      const { body } = await request(app).get("/api/plants/").expect(200);
      const { plants } = body;
      const lavenderPlants = plants.filter(
        (plant) => plant.species === "lavender",
      );
      const datePlanted = lavenderPlants.map((plant) => plant.created_at);
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
    test("when species queried, plants are ordered by created_at", async () => {
      const { body } = await request(app)
        .get("/api/plants?species=lavender")
        .expect(200);
      const { plants } = body;
      const datePlanted = plants.map((plant) => plant.created_at);
      expect(datePlanted).toBeSorted({ descending: true });
    });
  });
  describe("POST 201", () => {
    test("responds with a single object", async () => {
      const { body } = await request(app)
        .post("/api/plants/")
        .send({
          species: "lavender",
          coordinates: "51.5474,-0.1300",
          created_at: new Date(1609469200000),
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
          coordinates: "51.5474,-0.1300",
          created_at: new Date(1609469200000),
        })
        .expect(201);
      const { plant } = body;
      expect(typeof plant.species).toBe("string");
      expect(typeof plant.coordinates).toBe("string");
      expect(typeof plant.created_at).toBe("string");
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
  describe("GET 200", () => {
    test("responds with a single object", async () => {
      const { body } = await request(app).get("/api/plants/1").expect(200);
      expect(body).toBeObject();
      expect(body.plants).not.toBeArray();
    });
    test("plant object contains correct keys", async () => {
      const { body } = await request(app).get("/api/plants/1").expect(200);
      const { plant } = body;

      expect(typeof plant.species).toBe("string");
      expect(typeof plant.coordinates).toBe("string");
      expect(typeof plant.created_at).toBe("string");
    });
  });

  describe("PATCH 200", () => {
    test("responds with the updated plant object", async () => {
      const { body } = await request(app)
        .patch("/api/plants/1")
        .send({
          species: "olive tree",
        })
        .expect(200);

      const { plant } = body;
      expect(plant).toBeObject();
      expect(plant).not.toBeArray();
    });

    test("responds with object with correct shape", async () => {
      const { body } = await request(app)
        .patch("/api/plants/1")
        .send({
          species: "olive tree",
        })
        .expect(200);
      const { plant } = body;
      expect(typeof plant.species).toBe("string");
      expect(typeof plant.coordinates).toBe("string");
      expect(typeof plant.created_at).toBe("string");
    });
    test("when one field updated, the updated field reflects the sent data", async () => {
      const updatedData = { species: "olive tree" };
      const { body } = await request(app)
        .patch("/api/plants/3")
        .send(updatedData)
        .expect(200);
      const { plant } = body;
      expect(plant.species).toBe("olive tree");
    });
    test("when multiple fields are updated, the updated fields reflect the sent data", async () => {
      const updatedData = {
        species: "olive tree",
        coordinates: "51.5081,-0.0759",
      };
      const { body } = await request(app)
        .patch("/api/plants/3")
        .send(updatedData)
        .expect(200);
      const { plant } = body;
      expect(plant.species).toBe(updatedData.species);
      expect(plant.coordinates).toBe(updatedData.coordinates);
    });
  });

  describe("DELETE 204", () => {
    test("responds with no content", async () => {
      const { body } = await request(app).delete("/api/plants/1").expect(204);
      expect(body).toEqual({});
    });
  });

  describe("ERROR: INVALID METHOD 405", () => {
    test("returns 405 status code and error message when invalid method used", async () => {
      const methods = ["put", "post"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/plants/:plant_id/")
          .expect(405);
        expect(body.msg).toBe("Method not allowed");
      });
    });
  });

  describe("ERROR: INVALID INPUT 400", () => {
    test("returns 400 status code and error message when getting with invalid plant id", async () => {
      const { body } = await request(app).get("/api/plants/userid").expect(400);
      expect(body.msg).toBe("Invalid plant id");
    });

    test("returns 400 status code and error message when patching with invalid plant id", async () => {
      const { body } = await request(app)
        .patch("/api/plants/userid")
        .send({
          species: "olive tree",
        })
        .expect(400);
      expect(body.msg).toBe("Invalid plant id");
    });

    test("returns 400 status code and error message when deleting with invalid plant id", async () => {
      const { body } = await request(app)
        .delete("/api/plants/userid")
        .expect(400);
      expect(body.msg).toBe("Invalid plant id");
    });
  });

  describe("ERROR: NOT FOUND 404", () => {
    test("returns 404 status code and error message when getting with invalid plant id", async () => {
      const { body } = await request(app).get("/api/plants/99999").expect(404);
      expect(body.msg).toBe("Plant id not found");
    });

    test("returns 404 status code and error message when patching with invalid plant id", async () => {
      const { body } = await request(app)
        .patch("/api/plants/99999")
        .send({
          species: "olive tree",
        })
        .expect(404);
      expect(body.msg).toBe("Plant id not found");
    });

    test("returns 404 status code and error message when deleting with invalid plant id", async () => {
      const { body } = await request(app)
        .delete("/api/plants/99999")
        .expect(404);
      expect(body.msg).toBe("Plant id not found");
    });
  });
});

describe("/api/plants/:plant_id/images", () => {
  describe("GET 200", () => {
    test("responds with an object with a key of plant_id with a value of an array of object", async () => {
      const { body } = await request(app)
        .get("/api/plants/1/images")
        .expect(200);
      expect(body).toBeObject();
      expect(body.images).toBeArray();
    });
    test("plant object contains correct keys", async () => {
      const { body } = await request(app)
        .get("/api/plants/1/images")
        .expect(200);
      const { images } = body;

      images.forEach((image) => {
        expect(typeof image.plant_id).toBe("number");
        expect(typeof image.date_taken).toBe("string");
        expect(typeof image.img_url).toBe("string");
      });
    });
  });

  describe("POST 201", () => {
    test("responds with an array containing one object when a single image is posted", async () => {
      const { body } = await request(app)
        .post("/api/plants/2/images")
        .send([
          {
            plant_id: 2,
            date_taken: "02/04/2026",
            img_url:
              "https://images.pexels.com/photos/931177/pexels-photo-931179.jpeg?w=700&h=700",
          },
        ])
        .expect(201);
      const { images } = body;
      expect(images).toBeArray();
      expect(images.length).toBe(1);
    });

    test("responds with an array containing of objects when images are posted", async () => {
      const { body } = await request(app)
        .post("/api/plants/2/images")
        .send([
          {
            plant_id: 2,
            date_taken: "02/04/2026",
            img_url:
              "https://images.pexels.com/photos/931177/pexels-photo-931179.jpeg?w=700&h=700",
          },
          {
            plant_id: 2,
            date_taken: "02/04/2026",
            img_url:
              "https://images.pexels.com/photos/931177/pexels-photo-931180.jpeg?w=700&h=700",
          },
          {
            plant_id: 2,
            date_taken: "02/08/2026",
            img_url:
              "https://images.pexels.com/photos/931177/pexels-photo-931181.jpeg?w=700&h=700",
          },
        ])
        .expect(201);
      const { images } = body;
      expect(images).toBeArray();
      expect(images.length).toBe(3);
    });

    test("each object in response array contains correct key properties", async () => {
      const newImages = [
        {
          plant_id: 2,
          date_taken: "02/04/2026",
          img_url:
            "https://images.pexels.com/photos/931177/pexels-photo-931179.jpeg?w=700&h=700",
        },
        {
          plant_id: 2,
          date_taken: "02/04/2026",
          img_url:
            "https://images.pexels.com/photos/931177/pexels-photo-931180.jpeg?w=700&h=700",
        },
        {
          plant_id: 2,
          date_taken: "02/08/2026",
          img_url:
            "https://images.pexels.com/photos/931177/pexels-photo-931181.jpeg?w=700&h=700",
        },
      ];

      const { body } = await request(app)
        .post("/api/plants/2/images")
        .send(newImages)
        .expect(201);
      const { images } = body;

      images.forEach((image) => {
        expect(typeof image.plant_id).toBe("number");
        expect(typeof image.date_taken).toBe("string");
        expect(typeof image.img_url).toBe("string");
      });
    });
  });

  describe("ERROR: INVALID METHOD 405", () => {
    test("returns 405 status code and error message when invalid method used", async () => {
      const methods = ["put", "patch", "delete"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/plants/:plant_id/images")
          .expect(405);
        expect(body.msg).toBe("Method not allowed");
      });
    });
  });

  describe("ERROR: INVALID INPUT 400", () => {
    test("returns 400 status code and error message when getting with invalid plant id", async () => {
      const { body } = await request(app)
        .get("/api/plants/userid/images")
        .expect(400);
      expect(body.msg).toBe("Invalid plant id");
    });

    describe("ERROR: NOT FOUND 404", () => {
      test("returns 404 status code and error message when getting with invalid plant id", async () => {
        const { body } = await request(app)
          .get("/api/plants/99999/images")
          .expect(404);
        expect(body.msg).toBe("Plant id not found");
      });
    });
  });
});

describe("/api/invalid-path", () => {
  test("Invalid path returns 400 error", async () => {
    const { body } = await request(app).get("/api/invalid-path").expect(400);
    expect(body.msg).toBe("Bad request");
  });
});

// describe("PATCH 201", () => {
//   test("responds with the updated plant object", async () => {
//     const { body } = await request(app)
//       .patch("/api/plants/1/images")
//       .send({
//         img_url:
//           "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
//       })
//       .expect(200);

//     const { images } = body;
//     expect(images).toBeObject();
//     expect(images).toBeArray();
//   });

//   test("responds with object with correct shape", async () => {
//     const { body } = await request(app)
//       .patch("/api/plants/1/images")
//       .send({
//         img_url:
//           "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
//       })
//       .expect(200);
//     const { images } = body;

//     images.forEach((image) => {
//       expect(typeof image.plant_id).toBe("integer");
//       expect(typeof image.date_taken).toBe("string");
//       expect(typeof image.img_url).toBe("string");
//     });
//   });
//   test("when one field updated, the updated field reflects the sent data", async () => {
//     const updatedData = {
//       img_url:
//         "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
//     };
//     const { body } = await request(app)
//       .patch("/api/plants/3/images")
//       .send(updatedData)
//       .expect(200);
//     const { plant } = body;
//     expect(plant.species).toBe("olive tree");
//   });
//   test("when multiple fields are updated, the updated fields reflect the sent data", async () => {
//     const updatedData = {
//       date_taken: "02/15/2026",
//       img_url:
//         "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
//     };
//     const { body } = await request(app)
//       .patch("/api/plants/3/images")
//       .send(updatedData)
//       .expect(200);
//     const { plant } = body;
//     expect(plant.date_taken).toBe(updatedData.date_taken);
//     expect(plant.img_url).toBe(updatedData.img_url);
//   });
// });

// describe("DELETE 204", () => {
//   test("responds with no content", async () => {
//     const { body } = await request(app)
//       .delete("/api/plants/1/images")
//       .expect(204);
//     expect(body).toEqual({});
//   });
// });
