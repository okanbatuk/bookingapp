"use strict";
import { Router } from "express";
import httpStatus from "http-status";
import authRoute from "./auth.route.js";
import usersRoute from "./users.route.js";
import hotelsRoute from "./hotels.route.js";
import roomsRoute from "./rooms.route.js";
import verifyJwt from "../middlewares/verifyAuth.js";

const router = Router();

router.get("/status", (req, res) => {
  res.status(httpStatus.OK).json({ message: "Everything is OK" });
});

router.use("/", authRoute);

router.use(verifyJwt);
router.use("/users", usersRoute);
router.use("/hotels", hotelsRoute);
router.use("/rooms", roomsRoute);

export default router;
