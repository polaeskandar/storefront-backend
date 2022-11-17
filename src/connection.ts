import Pool from "pg-pool";
import {
  ENV,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  TESTING_DATABASE_NAME,
  TESTING_DATABASE_USERNAME,
  TESTING_DATABASE_PASSWORD,
  TESTING_DATABASE_PORT,
} from "./constants";

let config;

if (ENV === "dev" || ENV === "prod") {
  config = {
    database: DATABASE_NAME,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
  };
} else {
  config = {
    database: TESTING_DATABASE_NAME,
    user: TESTING_DATABASE_USERNAME,
    password: TESTING_DATABASE_PASSWORD,
    port: TESTING_DATABASE_PORT,
  };
}

const connection = new Pool(config);

export default connection;
