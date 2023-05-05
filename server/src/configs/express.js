"use strict";
import express from "express";
import connectDb from "./dbconnect.js";
import router from "../api/routes/index.js";
import * as error from "../api/utils/errors.js";
import logger from "../api/middlewares/logger.js";
import resHelper from "../api/utils/response.js";

/*
 * Create app
 * @public
 */
const app = express();

// Request logging
app.use(logger());

// Connect to db
connectDb();

// Parse requests with JSON
app.use(express.json());

// response handler
app.use(resHelper);

// Routes
app.use("/api", router);

// Catch 404 error and forward to error handler
app.use(error.notFound);

// If error is not an instanceof APIError
app.use(error.converter);

export default app;
