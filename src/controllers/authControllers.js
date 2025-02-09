const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const sendMail=require("../ultils/sendMail")
const crypto=require('crypto')
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
    const { password, role,refreshToken, ...userData } = response.toObject();
    // tạo access token
    const accessToken = generateAccessToken(response._id, role);
    //tạo refresh token
    const newrefreshToken = generateRefreshToken(response._id);
    await User.findByIdAndUpdate(response._id, { refreshToken:newrefreshToken }, { new: true });
    // lưu refresh token vào cookie
    res.cookie("refreshToken", newrefreshToken, {
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

const getOne = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    return res.status(400).json({ success: false, mes: "User ID is required" });
  }

  try {
    const user = await User.findById(_id).select(
      "-refreshToken -password -role"
    );
    if (!user) {
      return res.status(404).json({ success: false, mes: "User not found" });
    }

    return res.status(200).json({ success: true, rs: user });
  } catch (error) {
    console.error("Error:", error); // Log lỗi chi tiết
    return res
      .status(500)
      .json({
        success: false,
        mes: "Internal Server Error",
        error: error.message,
      });
  }
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error("no refresh token in cookies");
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
});
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  //xóa refresh token ở cookie trình duyệt
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout is done",
  });
});
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangeToken()
  await user.save()
  const html =`Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15p kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`
  const data={
    email,
    html
  }
  const rs=await sendMail(data)
  return res.status(200).json({
    success:true,
    rs
  })
});
const resetPassword=asyncHandler(async(req,res)=>{
     const{password,token}=req.body
     if(!password || !token)throw new Error('missing input')
     const passwordResetToken=crypto.createHash('sha256').update(token).digest('hex')
     const user=await User.findOne({passwordResetToken,passwordResetExpires:{$gt:Date.now()}})
     if(!user) throw new Error('Invalid reset token')
     user.password=password
    user.passwordResetToken=undefined
    user.passwordChangeAt=Date.now()
    user.passwordResetExpires=undefined 
    await user.save()
    return res.status(200).json({
      success:user ? true : false,
      mes:user ? 'updated password':'something went wrong'
    })
})
const getUsers=asyncHandler(async(req,res)=>{
  const response=await User.find().select('-refrshToken -password -role')
  return res.status(200).json({
    success:response ? true : false,
    users:response
  })
})
const deleteUser=asyncHandler(async(req,res)=>{
  const{_id}=req.query
  if(!_id) throw new Error('Missing input')
  const response=await User.findByIdAndDelete(_id)
return res.status(200).json({
  success:response ? true : false,
  deletedUser:response ? `User with email ${response.email} deleted` : 'No user delete'
})
})
const updateUser=asyncHandler(async(req,res)=>{
  const {_id}=req.user
  if(!_id || Object.keys(req.body).length === 0) throw new Error("missing input")
  const response = await User.findByIdAndUpdate(_id,req.body,{new:true}).select('-password -role')
  return res.status(200).json({
    success:response ? true : false,
    updateUser:response ? response : 'No user update'
  })
})
const updateUserByid=asyncHandler(async(req,res)=>{
  const {uid}=req.params
  if(!_id || Object.keys(req.body).length === 0) throw new Error("missing input")
  const response = await User.findByIdAndUpdate(uid,req.body,{new:true}).select('-password -role')
  return res.status(200).json({
    success:response ? true : false,
    updateUser:response ? response : 'No user update'
  })
})
const updateUserAddress=asyncHandler(async(req,res)=>{
  const{_id}=req.user
  if(!req.body.address)throw new Error('Missing Inputs')
  const response=await User.findByIdAndUpdate(_id,{$push:{address:req.body.address}},{new:true}).select('-password -role')
  return res.status(200).json({
    success:response ? true : false,
    updateUserAddress: response ? response : 'Cannot update address'
  })
})
const updateCart=asyncHandler(async(req,res)=>{
   const{_id}=req.user
   const{pid,quantity,color}=req.body
   if(!pid || !quantity ||!color) throw new Error('Missing input')
   const user=await User.findById(_id)
   const alreadyProduct=user?.cart.find(el=>el.product.toString()===pid)
   if(alreadyProduct){
      if(alreadyProduct.color === color){
        const response=await User.updateOne({cart:{$elemMatch:alreadyProduct}},{$set:{"cart.$quantity":quantity}},{new:true})
        return res.status(200).json({
          success:response ? true : false,
          updateCart:response ? response : 'cannot response'
        })
      }else{
        const response=await User.findByIdAndUpdate(_id,{$push:{cart:{product:pid,quantity,color}}},{new:true})
      return res.status(200).json({
        success:response ? true : false,
        updateCart:response ? response : 'cannot response'
      })
      }
   }else{
      const response=await User.findByIdAndUpdate(_id,{$push:{cart:{product:pid,quantity,color}}},{new:true})
      return res.status(200).json({
        success:response ? true : false,
        updateCart:response ? response : 'cannot response'
      })
   }
})


module.exports = {
  register,
  login,
  getOne,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,updateUser,
  updateUserByid,
  updateUserAddress,
  updateCart
};
