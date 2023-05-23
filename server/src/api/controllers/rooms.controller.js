"use strict";
import roomService from "../services/rooms.service.js";

// Get All Rooms
const getRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getAll();
    res.respond(rooms);
  } catch (error) {
    next(error);
  }
};

// Get a Room info
const getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get room according to id
    const room = await roomService.get(id);

    res.respond(room);
  } catch (error) {
    next(error);
  }
};

// Create a new Room
const createRoom = async (req, res, next) => {
  try {
    const { hotelId } = req.params;

    // Check the hotel
    let check = await roomService.checkHotel(hotelId);

    // Create and save new room
    let savedRoom = check && (await roomService.create(req.body));

    // Push the new room through the hotel
    savedRoom && (await roomService.pushRoom(hotelId, savedRoom._id));

    res.onlyMessage(`${savedRoom.title} is created successfully..`);
  } catch (error) {
    next(error);
  }
};

// Update Room informations
const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Update the room
    let updatedRoom = await roomService.update(id, req.body);
    res.onlyMessage(`${updatedRoom.title} is updated successfully..`);
  } catch (error) {
    next(error);
  }
};

// Delete Room
const deleteRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Pull the room from hotel info
    const updatedHotel = await roomService.deleteRoomFromHotel(id);
    // Delete the room
    let deletedRoom = updatedHotel && (await roomService.deleteById(id));
    res.onlyMessage(`${deletedRoom.title} is deleted successfully..`);
  } catch (error) {
    next(error);
  }
};

export { getRooms, getRoomById, createRoom, updateRoom, deleteRoomById };
