import Joi from "joi";

const object = (args) => Joi.object(args);
const string = () => Joi.string();
const alternatives = () => Joi.alternatives();

export { object, string, alternatives };
