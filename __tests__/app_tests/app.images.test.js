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

describe("/api/images/:image_id", () => {
  describe("PATCH 201", () => {
    test("responds with the updated image object", async () => {
      const { body } = await request(app)
        .patch("/api/images/1")
        .send({
          img_url:
            "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
        })
        .expect(200);

      const { image } = body;

      expect(image).toBeObject();
      expect(image).not.toBeArray();
    });

    test("responds with object with correct shape", async () => {
      const { body } = await request(app)
        .patch("/api/images/1")
        .send({
          img_url:
            "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
        })
        .expect(200);
      const { image } = body;

      expect(typeof image.plant_id).toBe("number");
      expect(typeof image.date_taken).toBe("string");
      expect(typeof image.img_url).toBe("string");
    });

    test("when one field updated, the updated field reflects the sent data", async () => {
      const updatedData = {
        img_url:
          "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
      };
      const { body } = await request(app)
        .patch("/api/images/1")
        .send(updatedData)
        .expect(200);
      const { image } = body;

      expect(image.img_url).toBe(
        "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
      );
    });

    test("when multiple fields are updated, the updated fields reflect the sent data", async () => {
      const updatedData = {
        date_taken: "02/15/2026",
        img_url:
          "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
      };
      const { body } = await request(app)
        .patch("/api/images/1")
        .send(updatedData)
        .expect(200);
      const { image } = body;

      expect(image.date_taken).toBe(updatedData.date_taken);
      expect(image.img_url).toBe(updatedData.img_url);
    });
  });

  describe("DELETE 204", () => {
    test("responds with no content", async () => {
      const { body } = await request(app).delete("/api/images/1").expect(204);
      expect(body).toEqual({});
    });
  });

  describe("ERROR: INVALID METHOD 405", () => {
    test("returns 405 status code and error message when invalid method used", async () => {
      const methods = ["get", "put", "post"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/images/:image_id")
          .expect(405);
        expect(body.msg).toBe("Method not allowed");
      });
    });
  });

  describe("ERROR: INVALID INPUT 400", () => {
    test("returns 400 status code and error message when patching with invalid image id", async () => {
      const { body } = await request(app)
        .patch("/api/images/ahdajsdak")
        .send({
          img_url:
            "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
        })
        .expect(400);
      expect(body.msg).toBe("Invalid image id");
    });

    test("returns 400 status code and error message when deleting with invalid image id", async () => {
      const { body } = await request(app)
        .delete("/api/images/ahdajsdak")
        .expect(400);
      expect(body.msg).toBe("Invalid image id");
    });

    describe("ERROR: NOT FOUND 404", () => {
      test("returns 404 status code and error message when patching with invalid image id", async () => {
        const { body } = await request(app)
          .patch("/api/images/9999")
          .send({
            img_url:
              "https://images.pexels.com/photos/1470565/pexels-photo-1470565.jpeg?w=700&h=700",
          })
          .expect(404);
        expect(body.msg).toBe("Image id not found");
      });

      test("returns 404 status code and error message when patching with invalid image id", async () => {
        const { body } = await request(app)
          .delete("/api/images/9999")
          .expect(404);
        expect(body.msg).toBe("Image id not found");
      });
    });
  });
});

describe("api/images/display_images", () => {
  describe("GET 200", () => {
    test("responds with an object with a key of displayImages with a value of an array of objects", async () => {
      const { body } = await request(app)
        .get("/api/images/display_images")
        .expect(200);
      expect(body).toBeObject();
      expect(body.displayImages).toBeArray();
    });

    test("each image object contains correct keys", async () => {
      const { body } = await request(app)
        .get("/api/images/display_images")
        .expect(200);
      const { displayImages } = body;
      displayImages.forEach((displayImage) => {
        expect(typeof displayImage.plant_id).toBe("number");
        expect(typeof displayImage.date_taken).toBe("string");
        expect(typeof displayImage.img_url).toBe("string");
      });
    });

    test("the returned images are the most recent for each plant_id", async () => {
      const { body } = await request(app)
        .get("/api/images/display_images")
        .expect(200);

      const { displayImages } = body;

      displayImages.forEach((image) => {
        const allImagesForThisPlant = data.imagesData.filter(
          (img) => img.plant_id === image.plant_id,
        );

        const latestExpectedImage = allImagesForThisPlant.sort((a, b) => {
          return new Date(b.date_taken) - new Date(a.date_taken);
        })[0];

        expect(image.img_url).toBe(latestExpectedImage.img_url);
        expect(image.date_taken).toBe(latestExpectedImage.date_taken);
      });
    });
  });

  describe("ERROR: INVALID METHOD 405", () => {
    test("returns 405 status code and error message when invalid method used", () => {
      const methods = ["put", "post", "patch", "delete"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/images/display_images")
          .expect(405);
        expect(body.msg).toBe("Method not allowed");
      });
    });
  });
});

describe("/api/invalid-path", () => {
  test("Invalid path returns 404 error", async () => {
    const { body } = await request(app).get("/api/invalid-path").expect(404);
    expect(body.msg).toBe("Path not found");
  });
});
