import { hash, compare } from "bcrypt";
import User from "../models/User.js";
import httpStatus from "http-status";

// Create a new user
const create = (user) => {
  return new Promise(async (resolve, reject) => {
    let { username, email, password } = user;

    let conflictUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    }).lean();

    // hash the password
    let hashedPassword = !conflictUser && (await hash(password, 10));

    // Create new User
    const newUser = hashedPassword
      ? new User({
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: hashedPassword,
        })
      : null;

    // Resolve the new user after save the new user
    !conflictUser
      ? newUser
        ? (await newUser.save(), resolve(newUser))
        : reject({
            message: "Something went wrong",
            status: httpStatus.BAD_REQUEST,
          })
      : reject({
          message: "Username or email already in use..",
          status: httpStatus.CONFLICT,
        });
  });
};

// Login user
const login = (user) => {
  return new Promise(async (resolve, reject) => {
    let { username, email, password } = user;

    // Find the user who wants to login
    let existUser = await User.findOne({
      $or: [
        { username: username?.toLowerCase() },
        { email: email?.toLowerCase() },
      ],
    }).lean();

    // Compare the password with saved password
    let check = existUser ? await compare(password, existUser.password) : false;

    /*
     *
     * If user doesn't exist return not found error
     * However user exists but password doesn't match, return unauthorized error
     */
    existUser
      ? check
        ? (delete existUser.password, resolve(existUser))
        : reject({
            message: "Incorrect Password",
            status: httpStatus.UNAUTHORIZED,
          })
      : reject({ message: "User Not Found", status: httpStatus.NOT_FOUND });
  });
};

export { create, login };
