const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const data = require("../../db/data/test-data/index");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("seed plants table", () => {
  test("plants table exists", () => {
    return db
      .query(
        `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'plants'
            );`,
      )
      .then(({ rows: [{ exists }] }) => {
        expect(exists).toBe(true);
      });
  });

  test("plants table has plant_id column as integer", () => {
    return db
      .query(
        `SELECT *
            FROM information_schema.columns
            WHERE table_name = 'plants'
            AND column_name = 'plant_id';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("plant_id");
        expect(column.data_type).toBe("integer");
      });
  });

  test("plants table has plant_id column as the primary key", () => {
    return db
      .query(
        `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'plants';`,
      )
      .then(({ rows: [{ column_name }] }) => {
        expect(column_name).toBe("plant_id");
      });
  });

  test("plants table has species column as varying character", () => {
    return db
      .query(
        `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'plants'
            AND column_name = 'species';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("species");
        expect(column.data_type).toBe("character varying");
      });
  });

  test("plants table has coordinates column of varying character", () => {
    return db
      .query(
        `SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'plants'
            AND column_name = 'coordinates';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("coordinates");
        expect(column.data_type).toBe("character varying");
      });
  });

  test("plants table has created_at column as a timestamp", () => {
    return db
      .query(
        `SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'plants'
            AND column_name = 'created_at';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("created_at");
        expect(column.data_type).toBe("timestamp without time zone");
      });
  });

  test("created_at column has default value of the current timestamp", () => {
    return db
      .query(
        `SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'plants'
        AND column_name = 'created_at';`,
      )
      .then(({ rows: [{ column_default }] }) => {
        expect(column_default).toBe("CURRENT_TIMESTAMP");
      });
  });
});
