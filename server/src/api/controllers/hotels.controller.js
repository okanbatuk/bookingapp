"use strict";
import * as hotelService from "../services/hotels.service.js";

// Get All Hotels
const getHotels = async (req, res, next) => {
  try {
    const hotels = await hotelService.getAll();
    res.respond(hotels);
  } catch (error) {
    next(error);
  }
};

// Get a hotel info
const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await hotelService.get(id);
    res.respond(hotel);
  } catch (error) {
    next(error);
  }
};

// Create a new Hotel
const createHotel = async (req, res, next) => {
  try {
    let newHotel = await hotelService.create(req.body);

    res.onlyMessage(`${newHotel.name} is created successfully..`);
  } catch (error) {
    next(error);
  }
};

// Update hotel informations
const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updatedHotel = await hotelService.update(id, req.body);
    res.onlyMessage(`${updatedHotel._id} is updated successfully..`);
  } catch (error) {
    next(error);
  }
};

// Delete hotel
const deleteHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check hotel own rooms if there is a room in hotel return error
    await hotelService.checkRooms(id);

    // Delete the hotel
    let deletedHotel = await hotelService.deleteById(id);
    res.onlyMessage(`${deletedHotel.name} is deleted successfully..`);
  } catch (error) {
    next(error);
  }
};

export { getHotels, getHotelById, createHotel, updateHotel, deleteHotelById };
