const Tag = require("../models/tags");
const Category = require("../models/Category");
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

//
exports.CategoryPageDetails = async (req, res) => {
  try {
    //get categoryId
    const { categoryId } = req.body;
    // get courses for specific ID
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();
    //validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data not Found",
      });
    }
    //get courses for different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();
    //get top selling courses

    //return
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to find different category",
    });
  }
};
