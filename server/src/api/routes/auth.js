"use strict";
import { Router } from "express";
import httpStatus from "http-status";

const router = Router();

router.route("/register").get((req, res, next) => {
  res.status(httpStatus.OK).json({ message: "Register Page" });
});

router.route("/login").get((req, res, next) => {
  res.status(httpStatus.OK).json({ message: "Login Page" });
});

export default router;
