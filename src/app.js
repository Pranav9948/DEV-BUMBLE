const express = require("express");
const PORT = 5000;

const { adminMiddleware, userMiddleware } = require("../middleware");

const app = express();

app.use("/admin", adminMiddleware);

app.use("/users", userMiddleware);

app.use("/login", (req, res) => {
  res.send("kindly login");
});

app.get("/users/get-profile-page", (req, res) => {
  res.send("user profile is loading");
});

app.get("/admin/get-users-for-admin", (req, res) => {
  throw new Error("something went wrong");
  res.send("here is list of users");
});

app.use((err, req, res, next) => {
  if (err) {
console.log('err',err)
   res.send('something went wrong')
  }
  next();
});

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
