"use strict";
import { Router } from "express";
import * as UserControllers from "../controllers/users.controller.js";
import * as UserValidations from "../middlewares/user.validation.js";

const router = Router();

router.get("/", UserControllers.getUsers);

router
  .route("/:id")
  .get(UserValidations.paramValidation, UserControllers.getUserById)
  .post(
    UserValidations.paramValidation,
    UserValidations.updatePasswordValidation,
    UserControllers.updatePassword
  )
  .put(
    UserValidations.paramValidation,
    UserValidations.updateUserValidation,
    UserControllers.updateUser
  )
  .delete(
    UserValidations.paramValidation,
    UserValidations.deleteUserValidation,
    UserControllers.deleteUserById
  );

export default router;
