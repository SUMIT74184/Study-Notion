const User = require("../models/User");
const OTP = require("../models/OTP");
const otpgenereator = require("otp-generator");

// Send Otp
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // check if the user is already existed or not
    const checkUserPresent = await User.findOne({ email });

    //if yes
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //if no
    var otp = otpgenereator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated :", otp);

    //check unique otp or not
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpgenereator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    //create an entry in db
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);
    //  return response sucessful
    res.status(200).json({
      success: true,
      message: "OTP sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signup
exports.SignUp = async (req, res) => {
  // data fetch from the body
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    phoneNumber,
    otp,
  } = req.body;
  //validate
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !otp
  ) {
    return res.status(403).json({
      success: false,
      message: "All fields are required",
    });
  }
  // 2 password match
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message:
        "password and confirmPassword value does not match,please try again",
    });
  }
  // check user already existed or not
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res.status(400).json({
      success: false,
      message: "User is already registered",
    });
  }

  // find the most recent OTP stored for the User
  const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
  console.log(recentOTP);
  // Hash password--39.09
  // create the entry in DB
};

//login

//change password

//isAdmin
