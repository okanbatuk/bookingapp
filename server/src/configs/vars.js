"use strict";
import path from "path";
import { config } from "dotenv-safe";

let port = "";
let db = "";
let ACCESS_TOKEN_SECRET = "";
let REFRESH_TOKEN_SECRET = "";

config({
  allowEmptyValues: true,
  path: path.join(path.resolve() + "/.env"),
});

(async () => {
  port = process.env.PORT;
  db = process.env.MONGO;
  ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
})();

export { port, db, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };
