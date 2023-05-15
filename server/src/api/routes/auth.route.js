"use strict";
import { Router } from "express";
import * as authControllers from "../controllers/auth.controller.js";
import * as authValidations from "../middlewares/auth.validate.js";

const router = Router();

// Routes of /api/register
router
  .route("/register")
  .get((req, res) => {
    res.onlyMessage("Register Page");
  })
  .post(authValidations.registerVal, authControllers.register);

// Routes of /api/login
router
  .route("/login")
  .get((req, res) => {
    res.onlyMessage("Login Page");
  })
  .post(authValidations.loginVal, authControllers.login);

// Route of /api/refresh/:id
router.get("/refresh/:id", authControllers.regenerateToken);

// Route of /api/logout
router.get("/logout", authControllers.logout);

export default router;
