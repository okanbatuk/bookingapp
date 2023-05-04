import httpStatus from "http-status";
import * as hotelService from "../services/hotels.service.js";

// Get All Hotels
const getHotels = async (req, res, next) => {
  try {
    const hotels = await hotelService.getAll();
    res.status(httpStatus.OK).json(hotels);
  } catch (error) {
    res.status(error.status).json({ success: false, message: error.message });
  }
};

// Get a hotel info
const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await hotelService.get(id);
    res.status(httpStatus.OK).json(hotel);
  } catch (error) {
    res.status(error.status).json({ success: false, message: error.message });
  }
};

// Create a new Hotel
const createHotel = async (req, res, next) => {
  try {
    let newHotel = await hotelService.create(req.body);

    res.status(httpStatus.OK).json({
      success: true,
      message: `${newHotel.name} is created successfully..`,
    });
  } catch (error) {
    res.status(error.status).json({ success: false, message: error.message });
  }
};

// Update hotel informations
const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updatedHotel = await hotelService.update(id, req.body);
    res.status(httpStatus.OK).json({
      success: true,
      message: `${updatedHotel._id} is updated successfully..`,
    });
  } catch (error) {
    res.status(error.status).json({ success: false, message: error.message });
  }
};

// Delete hotel
const deleteHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deletedHotel = await hotelService.deleteById(id);
    res.status(httpStatus.OK).json({
      success: true,
      message: `${deletedHotel.name} is deleted successfully..`,
    });
  } catch (error) {
    res.status(error.status).json({ success: false, message: error.message });
  }
};

export { getHotels, getHotelById, createHotel, updateHotel, deleteHotelById };
