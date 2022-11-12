import Pool from "pg-pool";
import { ENV, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USERNAME, TESTING_DATABASE_NAME, TESTING_DATABASE_USERNAME, TESTING_DATABASE_PASSWORD, TESTING_DATABASE_PORT } from "./constants";

const connection = new Pool(
  ENV === "dev" || ENV === "prod"
    ? {
        database: DATABASE_NAME,
        user: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
        port: DATABASE_PORT,
      }
    : {
        database: TESTING_DATABASE_NAME,
        user: TESTING_DATABASE_USERNAME,
        password: TESTING_DATABASE_PASSWORD,
        port: TESTING_DATABASE_PORT,
      }
);

export default connection;
