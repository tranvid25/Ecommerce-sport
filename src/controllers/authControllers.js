const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

// Tạo Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, admin: user.admin },
    process.env.JWT_SECRET,
    { expiresIn: "30s" }
  );
};

// Tạo Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, admin: user.admin },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "365d" }
  );
};

// Đăng ký người dùng
const registerUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, address } = req.body;

    if (!username || !email || !password || !phoneNumber || !address) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or username already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

// Đăng nhập người dùng
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

// Refresh Token
const requestRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "You are not authenticated" });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ success: false, message: "Invalid refresh token" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });

    res.status(200).json({ accessToken: newAccessToken });
  });
};

// Lấy danh sách người dùng
const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cập nhật người dùng
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phoneNumber, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, phoneNumber, address },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findById(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const userlogout = async (req, res) => {
   res.clearCookie("refreshToken");
   refreshTokens=refreshTokens.filter(token => token !== req.cookies.refreshToken);
   res.status(200).json("Đăng xuất thành công")
  };
  

module.exports = {
  registerUser,
  loginUser,
  requestRefreshToken,
  getUser,
  updateUserById,
  deleteUser,
  userlogout
};
