"use strict";
import path from "path";
import { config } from "dotenv-safe";

let port = "";
let db = "";

config({
  allowEmptyValues: true,
  path: path.join(path.resolve() + "/.env"),
});

(async () => {
  port = process.env.PORT;
  db = process.env.MONGO;
})();

export { port, db };
