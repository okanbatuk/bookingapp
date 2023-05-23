import httpStatus from "http-status";
import Hotel from "../models/Hotel.js";
import { Types } from "mongoose";

/*
 * Get all hotels
 *
 * GET /api/hotels
 */
const getAll = () => {
  return new Promise(async (resolve, reject) => {
    const hotels = await Hotel.find().lean();
    hotels.length
      ? resolve(hotels)
      : reject({
          message: "There is no Hotel",
          status: httpStatus.NOT_FOUND,
        });
  });
};

/*
 * Get hotel according to id
 *
 * @param String id
 *
 * GET /api/hotels/:id
 * */
const get = (id) => {
  return new Promise(async (resolve, reject) => {
    const hotel = await Hotel.findById(id).lean();
    hotel
      ? resolve(hotel)
      : reject({ message: "Hotel not found..", status: httpStatus.NOT_FOUND });
  });
};

/*
 * Create new Hotel
 *
 * @body String name
 * @body String type
 * @body String city
 * @body String address
 * @body String distance
 * @body String title
 * @body String desc
 * @body Number cheapestPrice
 *
 * POST /api/hotels
 */
const create = (hotel) => {
  return new Promise(async (resolve, reject) => {
    // Create new hotel
    const newHotel = new Hotel(hotel);
    // Save the hotel
    const savedHotel = await newHotel.save();
    savedHotel
      ? resolve(savedHotel)
      : reject({
          message: "Something went wrong",
          status: httpStatus.BAD_REQUEST,
        });
  });
};

/*
 * Update Hotel according to id
 *
 * @param String id
 *
 * @body String name
 * @body String type
 * @body String city
 * @body String address
 * @body String distance
 * @body String title
 * @body String desc
 * @body Number cheapestPrice
 *
 * PUT /api/hotels/:id
 */
const update = (id, info) => {
  return new Promise(async (resolve, reject) => {
    // Second option returns new version of data
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { $set: info, $currentDate: { lastModified: true } },
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

const checkRooms = (id) => {
  // Convert the id to ObjectId
  const objectId = new Types.ObjectId(id);
  return new Promise(async (resolve, reject) => {
    // It projects the size of the rooms in the hotel whose matches with id
    const hotels = await Hotel.aggregate([
      { $match: { _id: objectId } },
      {
        $project: { numberOfRooms: { $size: "$rooms" } },
      },
    ]);

    // if number of rooms that found is greater than 0 returns error
    hotels[0].numberOfRooms === 0
      ? resolve(true)
      : reject({
          message: "This Hotel can not be deleted",
          status: httpStatus.BAD_REQUEST,
        });
  });
};

/*
 * Delete hotel according to id
 *
 * @param String id
 *
 * DELETE /api/hotels/:id
 */
const deleteById = (id) => {
  return new Promise(async (resolve, reject) => {
    const deletedHotel = await Hotel.findByIdAndDelete(id);
    deletedHotel
      ? resolve(deletedHotel)
      : reject({
          message: "Hotel not found",
          status: httpStatus.NOT_FOUND,
        });
  });
};

export { getAll, get, create, update, checkRooms, deleteById };
