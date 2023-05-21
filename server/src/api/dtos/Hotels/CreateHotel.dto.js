import { object, string, number } from "../../utils/joiMethods.js";

const createHotelSchema = object({
  name: string().min(3).max(50).required(),
  type: string().min(3).max(50).required(),
  title: string().min(3).max(50).required(),
  desc: string().min(3).max(100).required(),
  city: string().min(3).max(50).required(),
  address: string().min(3).max(50).required(),
  distance: string().min(3).max(50).required(),
  cheapestPrice: number().min(0).max(1_000_000).required(),
});

export default createHotelSchema;
