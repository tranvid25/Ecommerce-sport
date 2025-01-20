const jwt = require("jsonwebtoken");

const middlewareController = {
  // Middleware kiểm tra token
  verifyToken: (req, res, next) => {
    const token = req.headers.token; // Lấy token từ headers

    if (token) {
      const accessToken = token.split(" ")[1]; // Tách token từ định dạng `Bearer <token>`
      jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: "Token is not valid",
          });
        }
        req.user = user; // Gán thông tin người dùng từ token
        next();
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "You are not authenticated",
      });
    }
  },

  // Middleware kiểm tra quyền admin hoặc chủ sở hữu
  verifyTokenAndAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      try {
        // Kiểm tra quyền admin hoặc là chủ sở hữu tài khoản
        if (req.user.id === req.params.id || req.user.admin) {
          next();
        } else {
          return res.status(403).json({
            success: false,
            message: "You are not allowed to perform this action",
          });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "An error occurred while verifying permissions",
        });
      }
    });
  },
};

module.exports = middlewareController;
