const { instance } = require("../config/razorpay")
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capture the payments and initiate the razorpay orders
exports.capturepayment = async (req, res) => {
    //get course id , user id
    const { course_id } = req.body;
    const userId = req.user.id
    //validation
    //valid courseid
    if (!course_id) {
        return res.json({
            success: false,
            message: 'please provide the valid ccourse ID'
        })
    }

    //valid courseDetails
    let course;
    try {
        course = await Course.findById(course_id);
        if (!course) {
            return res.json({
                success: false,
                message: 'Could not find the Course'
            })
        }

        //user already existed
        const uid = mongoose.Types.ObjectId(userId);//depreciated
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: 'Student is already Enrolled'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }

    //order create
    const amount = course.price;
    const currency = "INR";
    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: course_id,
            userId,
        }
    };

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnails: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Could not initiate order"
        })
    }

}

//verify signature of razorpay and server
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
        console.log("payment is authorized");

        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            //fulfill the action

            //find the course and enroll the student in it
            const enrolledCourse = await Course.findByIdAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true },
            );

            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not Found",
                })
            }
            console.log(enrolledCourse)

            //find the student and add the course to their list enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { courses: courseId } },
                { new: true },
            )
            console.log(enrolledStudent);

            //mail send configuration
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "congratulation you are successfully enrolled in the course",
            );

            console.log(emailResponse);
            return res.status(200).json({
                success: true,
                message: "Signature verified and course added"
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }else{
        return res.json({
            success:false,
            message:"Unable to process the transaction,please try again in sometimes"
        })

    }

}