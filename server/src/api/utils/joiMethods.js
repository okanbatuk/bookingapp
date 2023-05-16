import Joi from "joi";
import JoiObj from "joi-objectid";

const object = (args) => Joi.object(args);
const objectId = JoiObj(Joi);
const string = () => Joi.string();
const alternatives = () => Joi.alternatives();

export { object, objectId, string, alternatives };
