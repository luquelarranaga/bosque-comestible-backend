const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const data = require("../../db/data/test-data/index");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("seed logs table", () => {
  test("logs table exists", () => {
    return db
      .query(
        `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'logs'
            );`,
      )
      .then(({ rows: [{ exists }] }) => {
        expect(exists).toBe(true);
      });
  });

  test("logs table has log_id column as integer", () => {
    return db
      .query(
        `SELECT *
            FROM information_schema.columns
            WHERE table_name = 'logs'
            AND column_name = 'log_id';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("log_id");
        expect(column.data_type).toBe("integer");
      });
  });

  test("logs table has log_id column as the primary key", () => {
    return db
      .query(
        `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'logs';`,
      )
      .then(({ rows: [{ column_name }] }) => {
        expect(column_name).toBe("log_id");
      });
  });

  test("logs table has plant_id column as integer", () => {
    return db
      .query(
        `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'logs'
            AND column_name = 'log_id';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("log_id");
        expect(column.data_type).toBe("integer");
      });
  });

  test("logs_id column references a logs_id from the plants table", () => {
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
          AND tc.table_name = 'logs'
          AND kcu.column_name = 'plant_id'
          AND ccu.table_name = 'plants'
          AND ccu.column_name = 'plant_id';
      `,
      )
      .then(({ rows }) => {
        expect(rows).toHaveLength(1);
      });
  });

  test("logs table has date_posted column of varying character", () => {
    return db
      .query(
        `SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'logs'
            AND column_name = 'date_posted';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("date_posted");
        expect(column.data_type).toBe("character varying");
      });
  });

  test("logs table has body column of varying character", () => {
    return db
      .query(
        `SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'logs'
            AND column_name = 'body';`,
      )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("body");
        expect(column.data_type).toBe("character varying");
      });
  });
});
