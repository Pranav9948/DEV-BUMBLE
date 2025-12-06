const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pranavat007_db_user:emet3NwYLglgl3Tb@cluster0.mn0yco4.mongodb.net/Dev_Tinder"
  );
};

module.exports = {
  connectDB,
};
