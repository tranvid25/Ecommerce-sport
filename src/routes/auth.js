const express = require("express");
const routerAPI = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
  updateUserById,
  requestRefreshToken,
  userlogout,
} = require("../controllers/authControllers");
const middlewareController = require("../controllers/middlewareController");

// Đăng ký người dùng
routerAPI.post("/register", registerUser);

// Đăng nhập
routerAPI.post("/login", loginUser);

// Làm mới token
routerAPI.post("/refresh", requestRefreshToken);

// Lấy danh sách người dùng (yêu cầu token)
routerAPI.get("/users", middlewareController.verifyToken, getUser);

// Xóa người dùng (yêu cầu token và quyền admin)
routerAPI.delete(
  "/users/:id",
  middlewareController.verifyTokenAndAdmin,
  deleteUser
);

// Cập nhật thông tin người dùng (yêu cầu token và quyền admin hoặc chính chủ)
routerAPI.put(
  "/users/:id",
  middlewareController.verifyTokenAndAdmin,
  updateUserById
);
routerAPI.post("/logout",middlewareController.verifyToken,userlogout)

module.exports = routerAPI;
