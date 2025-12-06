const express = require("express");
const { userAuth } = require("../middleware/middlewares");

const profileRouter = express.Router();

profileRouter.get("/get-user-profile", userAuth, async (req, res, next) => {
  try {
    const userDetails = req.user;

    res.status(200).send(userDetails);
  } catch (err) {
    next(err);
  }
});

module.exports = {
  profileRouter,
};
