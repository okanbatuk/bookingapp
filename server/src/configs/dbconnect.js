"use strict";
import mongoose from "mongoose";
import { db } from "./vars.js";

const connectDb = async () => {
  try {
    // Connect to mongo with mongoose
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export default connectDb;
