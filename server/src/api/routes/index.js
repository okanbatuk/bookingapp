"use strict";
import { Router } from "express";
import httpStatus from "http-status";
import authRoute from "./auth.js";
import usersRoute from "./users.js";
import hotelsRoute from "./hotels.js";
import roomsRoute from "./rooms.js";

const router = Router();

router.get("/status", (req, res) => {
  res.status(httpStatus.OK).json({ message: "Everything is OK" });
});

router.use("/", authRoute);
router.use("/users", usersRoute);
router.use("/hotels", hotelsRoute);
router.use("/rooms", roomsRoute);

export default router;
