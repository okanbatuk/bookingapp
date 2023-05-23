import httpStatus from "http-status";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

const roomService = {};

/*
 * Get all rooms
 *
 * GET /api/rooms
 */
roomService.getAll = () => {
  return new Promise(async (resolve, reject) => {
    const rooms = await Room.find().lean();
    rooms.length
      ? resolve(rooms)
      : reject({
          message: "There is no room",
          status: httpStatus.NOT_FOUND,
        });
  });
};

/*
 * Get room according to id
 *
 * @param String id
 *
 * GET /api/rooms/:id
 * */
roomService.get = (id) => {
  return new Promise(async (resolve, reject) => {
    const room = await Room.findById(id).lean();
    room
      ? resolve(room)
      : reject({ message: "Room not found..", status: httpStatus.NOT_FOUND });
  });
};

/*
 * Check the hotel according id
 *
 * @body String hotelId
 *
 * @private
 */
roomService.checkHotel = async (hotelId) => {
  return new Promise(async (resolve, reject) => {
    const count = await Hotel.countDocuments({ _id: hotelId });

    count
      ? resolve(true)
      : reject({
          message: "There is no hotel in the submitted id..",
          status: httpStatus.NOT_FOUND,
        });
  });
};

/*
 * Create new room
 *
 * @body String title
 * @body Number price
 * @body Number maxPeople
 * @body String desc
 * @body Array roomNumbers
 *
 * POST /api/rooms
 */
roomService.create = async (room) => {
  return new Promise(async (resolve, reject) => {
    const newRoom = new Room(room);

    newRoom
      ? (await newRoom.save(), resolve(newRoom))
      : reject({
          message: "Something went wrong",
          status: httpStatus.BAD_REQUEST,
        });
  });
};

/*
 * Push the new room to the hotel
 *
 * @private
 */
roomService.pushRoom = (hotelId, roomId) => {
  return new Promise(async (resolve, reject) => {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $push: { rooms: roomId } },
      { new: true }
    );

    updatedHotel
      ? resolve(updatedHotel)
      : reject({
          message: "Hotel not found",
          status: httpStatus.NOT_FOUND,
        });
  });
};

/*
 * Update room according to id
 *
 * @param String id
 *
 * @body String title
 * @body Number price
 * @body Number maxPeople
 * @body String desc
 *
 * PUT /api/rooms/:id
 */
roomService.update = (id, info) => {
  return new Promise(async (resolve, reject) => {
    // Second option returns new version of data
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { $set: info, $currentDate: { lastModified: true } },
      { new: true }
    );
    updatedRoom
      ? resolve(updatedRoom)
      : reject({
          message: "Room not found",
          status: httpStatus.NOT_FOUND,
        });
  });
};

/*
 * Delete room in hotel infos
 *
 * @private
 */
roomService.deleteRoomFromHotel = (id) => {
  return new Promise(async (resolve, reject) => {
    const updatedHotel = await Hotel.findOneAndUpdate(
      { rooms: id },
      {
        $pull: {
          rooms: id,
        },
      },
      { new: true }
    ).lean();

    updatedHotel
      ? resolve(updatedHotel)
      : reject({
          message: "Submitted room is not found in any hotel..",
          status: httpStatus.NOT_FOUND,
        });
  });
};

/*
 * Delete room according to id
 *
 * @param String id
 *
 * DELETE /api/rooms/:id
 */
roomService.deleteById = (id) => {
  return new Promise(async (resolve, reject) => {
    const deletedRoom = await Room.findByIdAndDelete(id).lean();
    deletedRoom
      ? resolve(deletedRoom)
      : reject({
          message: "Room not found",
          status: httpStatus.NOT_FOUND,
        });
  });
};

export default roomService;
