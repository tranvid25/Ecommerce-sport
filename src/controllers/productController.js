const { response } = require("express");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new Product",
  });
});
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product",
  });
});
const getAllProducts = asyncHandler(async (req, res) => {
  const producst = await Product.find();
  return res.status(200).json({
    success: producst ? true : false,
    productsData: producst ? producst : "Cannot get products",
  });
});
//filter
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // tách các trường đặc biệt khỏi query
  const excludefields = ["limit", "sort", "page", "fields"];
  excludefields.forEach((el) => delete queries[el]);
  //format lại các operators cho đúng cú pháp của mongoose
  let queryString = JSON.stringify(queries);
  queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedel) => `$${matchedel}`);
  const formatedQueries = JSON.parse(queryString);

  // filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Product.find(formatedQueries);
  //sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  //field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  //limit
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  queryCommand
    .then(async (response) => {
      // Xử lý kết quả khi truy vấn thành công
      const counts = await Product.find(formatedQueries).countDocuments(); // Đếm số tài liệu
      return res.status(200).json({
        success: response ? true : false,
        productDatas: response ? response : "Cannot get products",
        counts,
      });
    })
    .catch((err) => {
      // Xử lý lỗi nếu có
      return res.status(500).json({
        success: false,
        mes: err.message || "Something went wrong",
      });
    });

  //excute query
});
const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : "Cannot update products",
  });
});
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: deletedProduct ? true : false,
    deletedProduct: deletedProduct ? deletedProduct : "Cannot delete Product",
  });
});
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { start, comment, pid } = req.body;
  if (!start || !pid) throw new Error("Missing inputs");
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );
  if (alreadyRating) {
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: { "ratings.$.start": start, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else {
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { start, comment, postedBy: _id } },
      },
      { new: true }
    );
  }
  //Sum ratings
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length();
  const sumRatings = updateProduct.ratings.reduce(
    (sum, el) => sum + el.start,
    0
  );
  updatedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingCount) / 10;
  await updateProduct.save();
  return res.status(200).json({
    status: true,
  });
});
const uploadImagesProduct = asyncHandler(async (req, res) => {
  const{pid}=req.params;
  if(!req.files) throw new Error('Missing input');
  const response=await Product.findByIdAndUpdate(pid,{$push:{images:{$each:req.files.map(el=>el.path)}}},{new:true});
  return res.status(200).json({
    status:response ? true : false,
    updatedProduct:response ? response : 'cannot update image'
  })
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImagesProduct,
};
