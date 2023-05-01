import path from "path";
import { config } from "dotenv-safe";

let port = "";
let db_url = "";

config({
  allowEmptyValues: true,
  path: path.join(path.resolve() + "/.env"),
});

(async () => {
  port = process.env.PORT;
  db_url = process.env.MONGO;
})();

export { port, db_url };
