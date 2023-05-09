"use strict";
import { Router } from "express";
import * as UsersController from "../controllers/users.controller.js";

const router = Router();

router.get("/", UsersController.getUsers);

router
  .route("/:id")
  .get(UsersController.getUserById)
  .put(UsersController.updateUser)
  .delete(UsersController.deleteUserById);

export default router;
