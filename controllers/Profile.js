const Profile=require("../models/Profile");
const User=require("../models/User");

exports.updateProfile=async(req,res)=>{
    try{
    const {dateOfBirth="",about="",contactNumber,gender}=req.body;
    //get user ID
    const id=req.user.id;
    //validation
    if(!contactNumber ||!gender || !id){
        return res.status(400).json({
            success:false,
            message:"All the fields are necessary"
        })
    }
    //find profile
    const userDetails=await User.findById(id);
    const profileId=userDetails.additionalDetails;
    const profileDetails=await profileId.findById(profileId);

    //updating the details
    profileDetails.dateOfBirth=dateOfBirth;
    profileDetails.about=about;
    profileDetails.gender=gender;
    profileDetails.contactNumber=contactNumber;
    //saving the entry on the db
    await profileDetails.save();

    //return response

    }catch(error){

    }
}
//req schduled to delete the account  duration

//delete account
exports.deleteProfile=async(req,res)=>{
    //get id 
    const userDetails=await User.findById(id);
    if(!userDetails){
        return res.status(401).json({
            success:false,
            message:"User not found"
        })
    }

    //delete profile
    await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

    //delete user
    await User.findByIdAndDelete({_id:id});

    //return response
    return res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
}

//user from all the enrolled courses

exports.getAllUSerDEtails=async(req,res)=>{
    try{
        const id=req.user.id;
        const userDetails=await User.findById(id).populate("additionalDetails").exec()
            return res.status(200).json({
                success:true
            })
    }
catch(error){

}
}