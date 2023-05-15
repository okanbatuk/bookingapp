"use strict";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./dbconnect.js";
import router from "../api/routes/index.js";
import * as error from "../api/helpers/errors.js";
import logger from "../api/middlewares/logger.js";
import resHelper from "../api/helpers/response.js";

/*
 * Create app
 * @public
 */
const app = express();

// Request logging
app.use(logger());

// Enable Cross Origin Resource Sharing
app.use(cors());

// Connect to db
connectDb();

// Parse requests with JSON
app.use(express.json());

// Parse cookie
app.use(cookieParser());

// response handler
app.use(resHelper);

// Routes
app.use("/api", router);

// Catch 404 error and forward to error handler
app.use(error.notFound);

// If error is not an instanceof APIError
app.use(error.converter);

export default app;
