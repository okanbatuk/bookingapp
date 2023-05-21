import { object, string, number } from "../../utils/joiMethods.js";

const updateHotelSchema = object({
  name: string().min(3).max(50),
  type: string().min(3).max(50),
  title: string().min(3).max(50),
  desc: string().min(3).max(100),
  city: string().min(3).max(50),
  address: string().min(3).max(50),
  distance: string().min(3).max(50),
  cheapestPrice: number().min(0).max(1_000_000),
});

export default updateHotelSchema;
