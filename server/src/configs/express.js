"use strict";
import express from "express";
import connectDb from "./dbconnect.js";
import router from "../api/routes/index.js";

/*
 * Create app
 * @public
 */
const app = express();

// Connect to db
connectDb();

// Parse requests with JSON
app.use(express.json());

// Routes
app.use("/api", router);

export default app;
