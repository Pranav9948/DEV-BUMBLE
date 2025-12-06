const { User } = require("../models/userModel");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  const token = req.cookies.access_token;

  try {
    if (!token) {
      return next(new AppError("Token not Available Forbidden", 403));
    }

    var decoded = await jwt.verify(token, "DEV_TINDER");

    if (!decoded || !decoded?._id) {
      return next(new AppError("Invalid token", 400));
    }

    const user_id = decoded?._id;

    const userExist = await User.findById(user_id).select("-password");

    if (!userExist) {
      return next(new AppError("User  not found", 404));
    }

    req.user = userExist;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userAuth,
};
