const res = require("express/lib/response");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");


//reset password token
exports.resetPasswordTOken=async(req,res)=>{
   try{
     //get email from req body
     const email=req.body.email;

     //check user for this email,email validation  
     const user=await User.findOne({email:email});
     if(!user){
         return res.json({
             success:false,
             message:'Email is not registered'
         })
     }
     //generate the token
     const token=crypto.randomUUID();
     //update user by adding token and expiration time
     const updatedDetails=await User.findOneAndUpdate(
                                     {email:email},
                                     {
                                         token:token,
                                         resetPasswordExpires:Date.now()+5*60*1000,
 
                                     },
                                     {new:true});
                                 
 
 
     const  url=`http://localhost:3000/update-password/${token}`;
         //sending main containing the url
     await mailSender(email,
                      "Password Reset LInk",
                      `Password Reset LInk:${url}`        
                     );
     //return response
     return res.json({
         success:true,
         message:'Email sent Successfully to your mail,please check'
     })
 

   }catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:'Something went wrong while sending the mail link'
    })
   }
}

//reset password---stored inside the db
exports.resetPassword=async(req,res)=>{
    try{
        //data fetch
    const {password,confirmPassword,token}=req.body;

    //validation
    if(password !==confirmPassword){
        return res.json({
            success:false,
            message:"password is invalid"
        })
    }
    //get Userdetails from the db using the token
    const userdetails=await user.findOne({token:token})
    //if no entry--invalid token
    if(!userdetails){
        return res.json({
            success:false,
            message:'Token is invalid'
        });
    }
    //token time expires
    if(userdetails.resetPasswordExpires < Date.now()){
        return res.json({
            success:false,
            message:'Token is expired,please regenerate your token'
        });
    }
    //hash password
    const hashedPassword=await bcrypt.hash(password,12);
    //update the password
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    );
    //return response
    return res.status(200).json({
        success:true,
        message:'Password reset Successfully'
    })

    }catch(error){
       console.log(error);
       return res.status(500).json({
        success:false,
        message:"something went wrong while reseting the password"
       }) 
    }
}