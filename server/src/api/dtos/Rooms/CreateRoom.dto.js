import { object, string, number, array } from "../../utils/joiMethods.js";

const createRoomSchema = object({
  title: string().min(3).max(50).required(),
  price: number().min(0).max(1_000_000).required(),
  maxPeople: number().min(1).max(10).required(),
  desc: string().min(3).max(100).required(),
  roomNumbers: array()
    .items(object({ number: number().min(1).max(100_000).required() }))
    .required(),
});

export default createRoomSchema;
