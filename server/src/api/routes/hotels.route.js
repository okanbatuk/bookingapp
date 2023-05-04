"use strict";
import { Router } from "express";
import * as hotelsController from "../controllers/hotels.controller.js";
// import httpStatus from "http-status";

const router = Router();

router
  .route("/")
  .get(hotelsController.getHotels)
  .post(hotelsController.createHotel);

router
  .route("/:id")
  .get(hotelsController.getHotelById)
  .put(hotelsController.updateHotel)
  .delete(hotelsController.deleteHotelById);

export default router;
