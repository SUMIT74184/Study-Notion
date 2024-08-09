const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL, {})
    .then(() => console.log("DB is connected successfully"))
    .catch((error) => {
      console.log("DB connection Failed");
      console.log(error);
      process.exit(1);
    });
};
