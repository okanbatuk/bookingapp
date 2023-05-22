"use strict";
import { Router } from "express";
import * as roomsController from "../controllers/rooms.controller.js";
import { verifyAdmin } from "../middlewares/role.verification.js";

const router = Router();

router.route("/").get(roomsController.getRooms);

// only admin user can send post req to /rooms/:hotelId
router.route("/:hotelId").post(verifyAdmin, roomsController.createRoom);

router
  .route("/:id")
  // all user can send get req
  .get(roomsController.getRoomById)
  // only admin user can send put and delete req to /rooms/:id
  .put(verifyAdmin, roomsController.updateRoom)
  .delete(verifyAdmin, roomsController.deleteRoomById);

export default router;
