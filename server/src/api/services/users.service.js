import { hash, compare } from "bcrypt";
import httpStatus from "http-status";
import User from "../models/User.js";

// Get All Users
const getAll = () => {
  return new Promise(async (resolve, reject) => {
    const users = await User.find().lean();
    users.length
      ? resolve(users)
      : reject({
          message: "There is no User",
          status: httpStatus.NOT_FOUND,
        });
  });
};

// Get a User info
const get = (id) => {
  return new Promise(async (resolve, reject) => {
    const user = await User.findById(id).lean();
    user
      ? resolve(user)
      : reject({ message: "User not found..", status: httpStatus.NOT_FOUND });
  });
};

/*
 * Check submitted password for security when updating user info
 *
 * @private
 * */
const checkPassword = (id, password) => {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ _id: id }, { password: 1 }).lean();
    const check = user && (await compare(password, user.password));

    user
      ? check
        ? resolve(true)
        : reject({
            message: "Your submitted password is not correct..",
            status: httpStatus.FORBIDDEN,
          })
      : reject({
          message: "User Not Found..",
          status: httpStatus.NOT_FOUND,
        });
  });
};

/*
 * Check submitted info for conflict when updating user info
 *
 * @private
 * */
const checkFields = async (id, info) => {
  let { username, email } = info;
  return new Promise(async (resolve, reject) => {
    // check the submitted username or email
    const conflict = await User.findOne({
      $and: [
        {
          $or: [
            { username: username?.toLowerCase() },
            { email: email?.toLowerCase() },
          ],
        },
        { _id: { $ne: id } },
      ],
    }).lean();

    conflict
      ? reject({
          message: "Username and/or email already used..",
          status: httpStatus.CONFLICT,
        })
      : resolve(true);
  });
};

// Update User informations
const update = (id, info) => {
  return new Promise(async (resolve, reject) => {
    // Second option returns new version of data
    const { modifiedCount } = await User.updateOne(
      { _id: id },
      {
        $set: info,
        $currentDate: { lastModified: true },
      }
    );
    modifiedCount
      ? resolve(true)
      : reject({
          message: "Nothing has been updated..",
          status: httpStatus.BAD_REQUEST,
        });
  });
};

// Update the user password
const updatePasswd = (id, newPass) => {
  return new Promise(async (resolve, reject) => {
    const hashedPassword = await hash(newPass, 10);
    const { modifiedCount } = await User.updateOne(
      { _id: id },
      {
        $set: { password: hashedPassword },
        $currentDate: { lastModified: true },
      }
    );

    modifiedCount
      ? resolve(true)
      : reject({
          message: "Something went wrong!!",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        });
  });
};

// Delete User
const deleteById = (id) => {
  return new Promise(async (resolve, reject) => {
    const deletedUser = await User.findByIdAndDelete(id).lean();
    deletedUser
      ? resolve(deletedUser)
      : reject({
          message: "User not found",
          status: httpStatus.NOT_FOUND,
        });
  });
};

export {
  getAll,
  get,
  update,
  checkPassword,
  checkFields,
  updatePasswd,
  deleteById,
};
