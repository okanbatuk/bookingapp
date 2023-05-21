import Joi from "joi";
import JoiObj from "joi-objectid";

const object = (args) => Joi.object(args);
const objectId = JoiObj(Joi);
const string = () => Joi.string();
const number = () => Joi.number();
const alternatives = () => Joi.alternatives();

export { object, objectId, string, number, alternatives };
