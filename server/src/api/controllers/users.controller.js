"use strict";
import * as UserService from "../services/users.service.js";
import redisClient from "../../configs/redisconnect.js";

/*
 * Get all Users
 *
 * GET /api/users
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAll();
    res.respond(users);
  } catch (error) {
    next(error);
  }
};

/*
 * Get User according to id
 *
 * @param String id
 *
 * GET /api/users/:id
 * */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserService.get(id);
    res.respond(user);
  } catch (error) {
    next(error);
  }
};

/*
 * Update User according to id
 *
 * @param String id
 *
 * @body String username
 * @body String email
 * @body String password (for security)
 *
 * PUT /api/users/:id
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const info = {
      username: req.body?.username,
      email: req.body?.email,
    };

    // Check the submitted password
    await UserService.checkPassword(id, req.body.password);

    // Check username and/or email for conflict
    await UserService.checkFields(id, info);

    // Update the user information. Just one(username or email) or both
    await UserService.update(id, info);

    res.onlyMessage(`Information update completed successfully..`);
  } catch (error) {
    next(error);
  }
};

/*
 * Update User password according to id
 *
 * @body password
 * @body newPassword
 *
 * POST /api/users/:id
 * */
const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, newPassword } = req.body;

    // Check the submitted password
    await UserService.checkPassword(id, password);

    // Update the user password
    await UserService.updatePasswd(id, newPassword);

    res.onlyMessage(`Password updated successfully..`);
  } catch (error) {
    next(error);
  }
};

/*
 * Delete User according to id
 *
 * @param String id
 *
 * DELETE /api/users/:id
 */
const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Check the submitted password
    await UserService.checkPassword(id, password);

    // Delete the user
    let deletedUser = await UserService.deleteById(id);

    // Delete the token in cookies
    res.clearCookie("token", {
      httpOnly: true /* sameSite: "None", secure: true  */,
    });

    // Delete user tokens in Redis Cache Mem
    await redisClient.del(id);

    res.onlyMessage(`${deletedUser.username} is deleted successfully..`);
  } catch (error) {
    next(error);
  }
};

export { getUsers, getUserById, updateUser, updatePassword, deleteUserById };
