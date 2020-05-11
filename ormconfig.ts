require("dotenv").config();

const env = process.env;
const isTest = env.NODE_ENV === "test";

module.exports = {
  name: "default",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: isTest ? env.TEST_DB_NAME : env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
