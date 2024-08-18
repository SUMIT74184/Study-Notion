const User = require("../models/User");
const OTP = require("../models/OTP");
const otpgenereator = require("otp-generator");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();



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
  try{
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

  // validate otp
  if(recentOTP.length==0){
    return res.status(400).json({
      success:false,
      message:"OTP not found",
    })
  }else if(otp!==recentOTP.otp){
    return res.status(400).json({
      success:false,
      message:"invalid otp found",
    })
  }
  // Hash password
  const hashedPassword=await bcrypt.hash(password,12);

  // create the entry in DB
  const profileDetails=await Profile.create({
    gender:null,
    dateOfBirth:null,
    about:null,
    phoneNumber:null,
  })
  const user=await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password:hashedPassword,
    accountType,
    additionalDetails:profileDetails._id,
    image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
  })
  return res.status(200).json({
    success:true,
    message:"User registered Successfully",
  })

}catch(error){
console.log(error)
return res.status(500).json({
  success:false,
  message:"Unable to Signup, please try again in sometime"
})
}
}

// 

//login controllers
exports.login = async (req, res) => {
  try {
    // Get data from req body
    const { email, password } = req.body;

    // Validate data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: 'All fields are required, please try again'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found, please Signup first"
      });
    }

    // Generate the JWT after matching the password
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      // Create the cookies and send the response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: 'Logged in Successfully'
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid password or email,please try again"
    });
  }
};

//change password

exports.changePassword=async (req,res)=>{
  //get data from the req body
  //get old password,new password,confirmNewpassword
  //validation
  //update the password in database
  // send mailSender
  //return response
}
