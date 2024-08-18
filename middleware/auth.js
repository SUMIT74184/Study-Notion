const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");


// auth
exports.auth=async(req,res,next)=>{
    try{
        // extract token
        const token=req.cookies.token || req.body.token ||req.header("Authorisation").replace("Bearer","");

        //if token is missing,then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }
        //verify the token
        try{
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;

        }catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid",

            });
        }
        next();

    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went Wront While Validation-->token",

        });
    }

}

exports.isStudent=async(req,res,next)=>{
    try{
       if(req.user.accountType!=="Student"){
        return res.status(401).json({
            success:false,    //check user for this email,email validation

            message:'This the protected routes for the students only'
        })
       }
       next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User Role cannot be defined",

        });
    }
}
    //check user for this email,email validation

exports.isInstructor=async(req,res,next)=>{
    try{
       if(req.user.accountType!=="Instructor"){
        return res.status(401).json({
            success:false,
            message:'This the protected routes for the Instructor only'
        })
       }
       next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User Role cannot be defined",

        });
    }
}

//isAdmin
exports.isAdmin=async(req,res,next)=>{
    try{
       if(req.user.accountType!=="Admin"){
        return res.status(401).json({
            success:false,
            message:'This the protected routes for the Admin only'
        })
       }
       next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User Role cannot be defined",

        });
    }
}