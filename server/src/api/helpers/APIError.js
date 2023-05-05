import ExtendableError from "./extendError.js";

/*
 * Error represents
 * @extends {ExtendableError}
 *
 */

class APIError extends ExtendableError {
  constructor({ message, errors, status }) {
    super({ message, errors, status });
  }
}

export default APIError;
