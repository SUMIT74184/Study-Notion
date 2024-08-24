const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
require("dotenv").config()

//create the Subsection
exports.createSubsection=async(req,res)=>{
    try{
        //..fetch data from the req body
        const {SectionId,title,description,timeDuration}=req.body;
        //extract file.video
        const video=req.files.videoFile;
        //Validation
        if(!SectionId || !title ||!description || !timeDuration){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //upload video to CLoudinary
        const uploadDetails=await uploadImageToClodinary(video,process.env.FOLDER_NAME);
        //create the subsection
        const subsectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        //update the section with this section 
        const UpdatedSection=await Section.findByIdAndUpdate({_id:SectionId},
                                                            {$push:{
                                                                SubSection:subsectionDetails._id,
                                                            }},
                                                            {new:true}
            
            
            )
        //return response
        return res.status(200).json({
            success:true,
            message:"courseSection created successfully",
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create this SUbsection",
            error:error.message
        })

    }
}

//update the subsection
exports.UPdateSubsection=async(req,res)=>{
    try{


    }
    catch(error){

    }

}





//update the delete the section
exports.DeleteSubsection=async(req,res)=>{
    try{

    }
    catch(error){

    }

}