"use strict";
import mongoose from "mongoose";
import app from "./configs/express.js";
import { port } from "./configs/vars.js";

// If an error occur, this will be triggered
mongoose.connection.on(
  "error",
  console.error.bind(console, "Connnection error: ")
);

// If you disconnect db this event will be triggered
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

// Open the connection
mongoose.connection.once("open", () => {
  console.log("Connected to Mongo..");

  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening on port: ${port}`);
  });
});
