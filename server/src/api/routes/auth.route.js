"use strict";
import { Router } from "express";
import * as authControllers from "../controllers/auth.controller.js";
import dataValidation from "../middlewares/data.validation.js";
import {
  registerSchema,
  loginSchema,
  idParamSchema,
} from "../dtos/Users/index.js";

const router = Router();

// Routes of /api/register
router
  .route("/register")
  .get((req, res) => {
    res.onlyMessage("Register Page");
  })
  .post((req, res, next) => {
    dataValidation(registerSchema, req.body, next);
  }, authControllers.register);

// Routes of /api/login
router
  .route("/login")
  .get((req, res) => {
    res.onlyMessage("Login Page");
  })
  .post((req, res, next) => {
    dataValidation(loginSchema, req.body, next);
  }, authControllers.login);

// Route of /api/refresh/:id
router.route("/refresh/:id").get((req, res, next) => {
  dataValidation(idParamSchema, req.params, next);
}, authControllers.regenerateToken);

// Route of /api/logout
router.get("/logout", authControllers.logout);

export default router;
