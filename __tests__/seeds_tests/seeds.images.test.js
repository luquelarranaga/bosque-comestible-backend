const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const data = require("../../db/data/test-data/index");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("seed images table", () => {
  test("images table exists", () => {
    return db
      .query(
        `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'images'
            );`,
      )
      .then(({ rows: [{ exists }] }) => {
        expect(exists).toBe(true);
      });
  });

  test("images table has image_id column as integer", () => {
    return db
      .query(
        `SELECT *
            FROM information_schema.columns
            WHERE table_name = 'images'
            AND column_name = 'image_id';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("image_id");
        expect(column.data_type).toBe("integer");
      });
  });

  test("images table has image_id column as the primary key", () => {
    return db
      .query(
        `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'images';`,
      )
      .then(({ rows: [{ column_name }] }) => {
        expect(column_name).toBe("image_id");
      });
  });

  test("images table has plant_id column as integer", () => {
    return db
      .query(
        `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'images'
            AND column_name = 'plant_id';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("plant_id");
        expect(column.data_type).toBe("integer");
      });
  });

  test("plant_id column references a plant_id from the plants table", () => {
    return db
      .query(
        `
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'images'
          AND kcu.column_name = 'plant_id'
          AND ccu.table_name = 'plants'
          AND ccu.column_name = 'plant_id';
      `,
      )
      .then(({ rows }) => {
        expect(rows).toHaveLength(1);
      });
  });

  test("images table has date_taken column of varying character", () => {
    return db
      .query(
        `SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'images'
            AND column_name = 'date_taken';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("date_taken");
        expect(column.data_type).toBe("character varying");
      });
  });

  test("images table has img_url column of varying character", () => {
    return db
      .query(
        `SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'images'
            AND column_name = 'img_url';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("img_url");
        expect(column.data_type).toBe("character varying");
      });
  });
});
