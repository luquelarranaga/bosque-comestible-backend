DROP TABLE IF EXISTS plants;

CREATE TABLE plants (
    plant_id SERIAL PRIMARY KEY,
    species VARCHAR NOT NULL,
    date_planted TIMESTAMP,
    coordinates VARCHAR,
    body VARCHAR,
    care VARCHAR,
    img_url VARCHAR
);