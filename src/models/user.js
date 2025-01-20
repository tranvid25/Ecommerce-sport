const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin:{type:Boolean,default:false,required:true},
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", UserSchema); // Đảm bảo tên mô hình là 'User' với chữ cái hoa
module.exports = User;
