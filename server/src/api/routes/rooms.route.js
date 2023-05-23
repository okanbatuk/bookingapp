"use strict";
import { Router } from "express";
import * as roomsController from "../controllers/rooms.controller.js";
import { verifyAdmin } from "../middlewares/role.verification.js";
import dataValidation from "../middlewares/data.validation.js";
import {
  idParamSchema,
  createRoomSchema,
  updateRoomSchema,
} from "../dtos/Rooms/index.js";

const router = Router();

router.route("/").get(roomsController.getRooms);

// only admin user can send post req to /rooms/:hotelId
router
  .route("/:hotelId")
  .all((req, res, next) => {
    const data = {
      id: req.params.hotelId,
    };
    dataValidation(idParamSchema, data, next);
  })
  .post(
    verifyAdmin,
    (req, res, next) => {
      dataValidation(createRoomSchema, req.body, next);
    },
    roomsController.createRoom
  );

router
  .route("/:id")
  .all((req, res, next) => {
    dataValidation(idParamSchema, req.params, next);
  })
  // all user can send get req
  .get(roomsController.getRoomById)
  // only admin user can send put and delete req to /rooms/:id
  .put(
    verifyAdmin,
    (req, res, next) => {
      dataValidation(updateRoomSchema, req.body, next);
    },
    roomsController.updateRoom
  )
  .delete(verifyAdmin, roomsController.deleteRoomById);

export default router;
