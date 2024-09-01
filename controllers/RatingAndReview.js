const Course = require("../models/Course");
const RatingsAndReview = require("../models/RatingAndReviews");

//createRating
exports.createRating = async (req, res) => {
  try {
    //get userId
    const userId = req.user.id;
    //fetched the data from body
    const { rating, review, courseId } = req.body;
    //check if the user is enrolled in the course
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }
    //cehck of the user is already reviewed the course or not
    const alreadyReviewed = await RatingsAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewd by the User",
      });
    }
    //create rating and reviews
    const ratingReview = await RatingsAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    //update course with rating and reviews
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          RatingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );
    console.log(updatedCourseDetails);
    // return response
    return res.status(200).json({
      success: true,
      message: "Rating and reviews created successfully",
      ratingReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating the comment,",
    });
  }
};

//getAverageRating
exports.getAverageRating = async (req, res) => {
  try {
    //get course id
    const courseId = req.body.courseId;
    //calculate the avg rating
    const result = await RatingsAndReview.aggregate(
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      }
    );

    //check if
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    //if no rating
    return res.status(200).json({
      success: true,
      message: "No rating as if now",
      averageRating: 0,
    });
    //return rating
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
    //35
  }
};

//getAllRating
exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingsAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews are fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
