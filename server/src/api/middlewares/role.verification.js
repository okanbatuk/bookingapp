import httpStatus from "http-status";

const verifyUser = (req, res, next) => {
  const { id, role } = req.user;

  id === req.params?.id || role === "admin"
    ? next()
    : next({
        message: "You're not authorized",
        status: httpStatus.UNAUTHORIZED,
      });
};

const verifyAdmin = (req, res, next) => {
  const { role } = req.user;

  role === "admin"
    ? next()
    : next({
        message: "You don't have permission",
        status: httpStatus.FORBIDDEN,
      });
};

export { verifyUser, verifyAdmin };
