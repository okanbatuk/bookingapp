import { object, string, number, array } from "../../utils/joiMethods.js";

const updateRoomSchema = object({
  title: string().min(3).max(50),
  price: number().min(0).max(1_000_000),
  maxPeople: number().min(1).max(10),
  desc: string().min(3).max(100),
  roomNumbers: array()
    .min(1)
    .items(object({ number: number().min(1).max(100_000).required() })),
});

export default updateRoomSchema;
