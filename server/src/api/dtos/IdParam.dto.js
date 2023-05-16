import { object, objectId } from "../utils/joiMethods.js";

const idParamSchema = object({
  id: objectId(),
});

export default idParamSchema;
