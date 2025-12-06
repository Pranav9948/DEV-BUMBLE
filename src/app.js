const express = require("express");
const PORT = 5000;

const { adminMiddleware, userMiddleware } = require("../middleware");
const { connectDB } = require("./config/db");
const { User } = require("./models/userModel");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const { validateSignupData } = require("./utils/Validations");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/middlewares");
const { authRouter } = require("./router/authRouter");
const { profileRouter } = require("./router/profilerouter");

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB()
  .then(() => {
    console.log("connected to DB");
    app.listen(5000, () => {
      console.log("server listening on port 5000");
    });
  })
  .catch(() => console.log(`DB connection failed`));

app.use("/admin", adminMiddleware);

app.use("/users", userMiddleware);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.get("/get-all-users-from-DB", async (req, res, next) => {
  try {
    const allUsers = await User.find({});

    res.send(allUsers);
  } catch (err) {
    next(err);
  }
});

app.delete("/delete-user", async (req, res) => {
  try {
    const userDeleted = await User.findOneAndDelete(
      { email: req.body.email },
      { rawResult: true }
    );

    res.send("user deleted successfully");
  } catch (err) {
    next(err);
  }
});

app.patch("/update-user/:id", async (req, res, next) => {
  let updateddata = { ...req.body };

  const NOT_ALLOWED_UPDATES = ["email"];

  try {
    const notAllowedValuesUpdateDetected = Object.keys(req.body).some((v) =>
      NOT_ALLOWED_UPDATES.includes(v)
    );

    if (notAllowedValuesUpdateDetected) {
      return next(new AppError("Updating email is not allowed", 400));
    }

    if (Array.isArray(updateddata.skills)) {
      updateddata.skills = [...new Set(updateddata.skills)];
    }

    if (updateddata.skills.length > 10) {
      return next(new AppError("Skills cannot be more than 10", 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateddata,
      { new: true, runValidators: true }
    );
    res.send("user updated successfully");
  } catch (err) {
    console.error("err", err);
    next(err);
  }
});

app.use(errorHandler);
