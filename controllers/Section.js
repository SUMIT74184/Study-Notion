const Section=require("../models/Section");
const Course=require("../models/Course");

exports.createSection=async(req,res)=>{
    try{
      //  data fetch
      const [sectiionName,courseId]=req.body;
      //data validation
      if(!sectiionName || !courseId){
            return res.staus(400).jaon({
                success:false,
                message:"Missing Properties",
            });
        }
            //create section
            const newSection=await Section.create({sectiionName});
            //update course with section ObjectID
            const updatedCourseDetails=await Course.findByIdAndUpdate(
                courseId,
                {
                    $push:{
                        courseContent:newSection._id,
                    }
                },
                {new:true}//so that i get the updateed data for this
            );
            //use populte to replace the suction and subsection for the updatecourseDetails
      

            return res.status(200).json({
                success:true,
                message:"course-section fetched successfully",
                updatedCourseDetails
            })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to create the section",
            error:error.message
        })
    }
}

exports.UpateSection=async(req,res)=>{
    try{
    //data nput,
    const {sectionName,SectionId}=req.body;

    //data validation
    if(!sectionName || !SectionId){
        return res.staus(400).jaon({
            success:false,
            message:"Missing Properties",
        });
    }
    //update course
    const section=await Section.findByIdAndUpdate(SectionId,{sectionName},{new:true});
    //return response
    return res.status(200).json({
        success:true,
        message:"section Updated Successfully"
    })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to update Section,please try again",
            error:error.message,
        })
    }
}

exports.deleteSection=async(req,res)=>{
    try{
        //get id-->assumning that we are sendiing the id in params
        const {SectionId}=req.params

        //delete the section
        await Section.findByIdAndDelete(SectionId);
        //return response

        //course we are deleting it from the courseSchema
        return res.staus(200).json({
            success:true,
            message:'Section Deleted Successfully',
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable delete the Section,please try again"
        })
    }
}