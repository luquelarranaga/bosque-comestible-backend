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

describe("/api/logs/:log_id", () => {
  describe("PATCH 201", () => {
    test("responds with the updated log object", async () => {
      const { body } = await request(app)
        .patch("/api/logs/1")
        .send({
          body: "Planted three more",
        })
        .expect(200);

      const { log } = body;

      expect(log).toBeObject();
      expect(log).not.toBeArray();
    });

    test("responds with object with correct shape", async () => {
      const { body } = await request(app)
        .patch("/api/logs/1")
        .send({
          body: "Planted three more",
        })
        .expect(200);
      const { log } = body;

      expect(typeof log.plant_id).toBe("number");
      expect(typeof log.created_at).toBe("string");
      expect(typeof log.body).toBe("string");
    });

    test("when one field updated, the updated field reflects the sent data", async () => {
      const { body } = await request(app)
        .patch("/api/logs/1")
        .send({
          body: "Planted three more",
        })
        .expect(200);
      const { log } = body;

      expect(log.body).toBe("Planted three more");
    });

    describe("DELETE 204", () => {
      test("responds with no content", async () => {
        const { body } = await request(app).delete("/api/logs/1").expect(204);
        expect(body).toEqual({});
      });
    });

    describe("ERROR: INVALID METHOD 405", () => {
      test("returns 405 status code and error message when invalid method used", async () => {
        const methods = ["get", "put", "post"];
        methods.forEach(async (method) => {
          const { body } = await request(app)
            [method]("/api/logs/:log_id")
            .expect(405);
          expect(body.msg).toBe("Method not allowed");
        });
      });
    });

    describe("ERROR: INVALID INPUT 400", () => {
      test("returns 400 status code and error message when patching with invalid log id", async () => {
        const { body } = await request(app)
          .patch("/api/logs/ahdajsdak")
          .send({
            body: "Planted three more",
          })
          .expect(400);
        expect(body.msg).toBe("Invalid log id");
      });

      test("returns 400 status code and error message when deleting with invalid log id", async () => {
        const { body } = await request(app)
          .delete("/api/logs/ahdajsdak")
          .expect(400);
        expect(body.msg).toBe("Invalid log id");
      });
    });

    describe("ERROR: NOT FOUND 404", () => {
      test("returns 404 status code and error message when patching with invalid log id", async () => {
        const { body } = await request(app)
          .patch("/api/logs/9999")
          .send({
            body: "Planted three more",
          })
          .expect(404);
        expect(body.msg).toBe("Log id not found");
      });

      test("returns 404 status code and error message when patching with invalid log id", async () => {
        const { body } = await request(app)
          .delete("/api/logs/9999")
          .expect(404);
        expect(body.msg).toBe("Log id not found");
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
