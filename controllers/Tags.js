const Tag = require("../models/tags");
//create tag handler

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //creating the entry in the db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);
    //return response

    return res.status(200).json({
      success: true,
      message: "Successfully created the TAG",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the tags response",
    });
  }
};

exports.showAlltags = async (req, res) => {
  try {
    const alltags = await Tag.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All tags are fetched successfully",
      alltags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
