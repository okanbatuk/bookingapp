"use strict";
import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

// Routes of /api/register
router
  .route("/register")
  .get((req, res, next) => {
    res.onlyMessage("Register Page");
  })
  .post(authController.register);

// Routes of /api/login
router
  .route("/login")
  .get((req, res, next) => {
    res.onlyMessage("Login Page");
  })
  .post(authController.login);

// TODO: Regenerate the Access Token according to the Refresh Token

// Route of /api/logout
router.get("/logout", authController.logout);

export default router;
