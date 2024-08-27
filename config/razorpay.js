const Razorpay=require("razorpay");
require("dotenv").config()


exports.instance=new Razorpay({
    key_id:Process.env.RAZORPAY_KEY,
    key_secret:Process.env.RAZORPAY_SECRET,
});