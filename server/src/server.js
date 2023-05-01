import app from "./configs/express.js";
import { port } from "./configs/vars.js";

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listening on port: ${port}`);
});
