const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: Stirng,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
    requried: true,
  },
  additionalDetails: {
    type: mongoose.Schema.Type.ObjectId,
    required: true,
    ref: "Profile",
  },
  courses: [
    {
      type: mongoose.Schema.Type.ObjectId,
      ref: "Course",
    },
  ],
  image: {
    type: String,
    required: true,
  },
  courseProgress: [
    {
      type: mongoose.Schema.Type.ObjectId,
      ref: "CourseProgess",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
