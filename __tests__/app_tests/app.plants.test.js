import db from "../../db/connection";
import data from "../../db/";
import data from "../../db/data/test-data";
import seed from "../../db/seeds/seed";
import request from "supertest";
import app from "../../app";

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end;
});

/*
/api/plants
GET all species 
returns an array of objects
each object contains the keys: 
/api/plants?species=none
GET: all plants by species
POST: new plant (with all above metrics)
PATCH: individual plant (location?)
DELETE: indivual plant

api/plants/
GET: all plants
*/

describe("/api/plants/", () => {
  describe("GET 200", () => {
    test("responds with an object with a key of plants with a value of an array of objects", () => {
      return request(app)
        .get("api/plants/")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeObject();
          expect(body.plants).toBeArray();
        });
    });
  });
});
