"use strict";
import express from "express";
import connectDb from "./dbconnect.js";

/*
 * Create app
 * @public
 */
const app = express();

// Connect to db
connectDb();

export default app;
