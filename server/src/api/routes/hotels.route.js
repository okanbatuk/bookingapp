"use strict";
import { Router } from "express";
import * as hotelsController from "../controllers/hotels.controller.js";
import { verifyAdmin } from "../middlewares/role.verification.js";
import dataValidation from "../middlewares/data.validation.js";
import {
  idParamSchema,
  createHotelSchema,
  updateHotelSchema,
} from "../dtos/Hotels/index.js";

const router = Router();

router
  .route("/")
  .get(hotelsController.getHotels)
  // only admin user can send post request to /hotels/ url
  .post(
    verifyAdmin,
    (req, res, next) => {
      // if submitted data is not valid return error
      dataValidation(createHotelSchema, req.body, next);
    },
    hotelsController.createHotel
  );

router
  .route("/:id")
  .all((req, res, next) => {
    dataValidation(idParamSchema, req.params, next);
  })
  // all user can send get req
  .get(hotelsController.getHotelById)
  // only admin user can send put and delete req to /hotels/:id
  .put(
    verifyAdmin,
    (req, res, next) => {
      // if submitted data is not valid return error
      dataValidation(updateHotelSchema, req.body, next);
    },
    hotelsController.updateHotel
  )
  .delete(verifyAdmin, hotelsController.deleteHotelById);

export default router;
