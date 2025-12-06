const express = require("express");
const { validateSignupData } = require("../utils/Validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  let newSkills;

  try {
    validateSignupData(req.body);

    if (Array.isArray(req.body.skills)) {
      newSkills = [...new Set(req.body.skills)];
    }

    if (newSkills.length > 10) {
      return next(new AppError("Skills cannot be more than 10", 400));
    }
    req.body.skills = newSkills;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({ ...req.body, password: hashedPassword });

    const savedUser = await newUser.save();

    res.status(200).send("user saved successfully");
  } catch (err) {
    console.error("errr", err);
    res.status(500).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    const passwordMatched = await userExist.verifyPassword(password);

    if (passwordMatched) {
      const User_Token = await userExist.createJwtToken();

      return res
        .cookie("access_token", User_Token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ message: "Logged in successfully 😊 👌" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = {
  authRouter,
};
