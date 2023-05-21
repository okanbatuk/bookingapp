"use strict";
import { Router } from "express";
import * as UserControllers from "../controllers/users.controller.js";
import * as userSchemas from "../dtos/Users/index.js";
import verifyUser from "../middlewares/verifyUser.js";
import dataValidation from "../middlewares/data.validation.js";

const router = Router();

// Check the user who sent request if the user is admin
router.get("/", verifyUser, UserControllers.getUsers);

router
  .route("/:id")
  // verify the users token who sent request and compare params id with user id
  .all((req, res, next) => {
    dataValidation(userSchemas.idParamSchema, req.params, next);
  }, verifyUser)
  .get(UserControllers.getUserById)
  .post((req, res, next) => {
    dataValidation(userSchemas.updatePasswdSchema, req.body, next);
  }, UserControllers.updatePassword)
  .put((req, res, next) => {
    dataValidation(userSchemas.updateUserSchema, req.body, next);
  }, UserControllers.updateUser)
  .delete((req, res, next) => {
    dataValidation(userSchemas.deleteUserSchema, req.body, next);
  }, UserControllers.deleteUserById);

export default router;
