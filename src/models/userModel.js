const mongoose = require("mongoose");
var validator = require("validator");
const AppError = require("../utils/AppError");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 2,
      maxLength: 12,
      required: true,
      get: (v) => v.toUpperCase(),
    },
    lastName: {
      type: String,
    },

    age: {
      type: Number,
      min: 14,
      max: 92,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowerCase: true,
      trim: true,
      unique: true,
      index: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("not a valid email");
        }
      },
    },

    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("pls enter a strong password");
        }
      },
    },

    photoUrl: {
      type: String,
      default: "https://img.icons8.com/nolan/1200/user-default.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("pls enter a valid photo url");
        }
      },
    },

    skills: {
      type: [String],
      required: true,
    },

    about: {
      type: String,
      default: "This is the default description of user",
    },
  },
  { timestamps: true }
);

userSchema.methods.createJwtToken = async function () {
  const userDetails = this;

  const token = await jwt.sign({ _id: userDetails._id }, "DEV_TINDER", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.verifyPassword = async function (password) {
  const userDetails = this;

  return await bcrypt.compare(password, userDetails.password);
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
