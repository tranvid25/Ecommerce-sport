const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, phoneNumber } = req.body;

  // Kiểm tra nếu thiếu thông tin
  if (!email || !password || !lastname || !firstname || !phoneNumber) {
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  }

  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      mes: "Invalid email format",
    });
  }

  // Kiểm tra nếu email đã tồn tại
  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User has existed!");
  } else {
    // Tạo người dùng mới
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser
        ? `Register is successfully. Please go login`
        : "Something went wrong",
    });
  }
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  const response = await User.findOne({ email });
  // tách password ra khỏi response
  if (response && (await response.isCorrectPassword(password))) {
    const { password, role, ...userData } = response.toObject();
    // tạo access token
    const accessToken = generateAccessToken(response._id, role);
    //tạo refresh token
    const refreshToken = generateRefreshToken(response._id);
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
    // lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid creadentials");
  }
});

module.exports = {
  register,
  login,
};
