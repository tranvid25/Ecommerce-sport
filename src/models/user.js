const mongoose = require("mongoose");
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const userSchema = new mongoose.Schema(
  {
  firstname:{
    type:String,
    required:true,
  },
  lastname:{
    type:String,
    required:true
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:{type:String,default:"user"},
  cart:[
    {
     product:{type:mongoose.Types.ObjectId,ref:'Product'},
     quantity:Number,
     color:String,
    }
  ],
  phoneNumber: { type: String,required:true,unique:true},
  address:{type:Array,default:[]},
  wishlist:[{type:mongoose.Types.ObjectId,ref:'Product'}],
  isBlocked:{
    type:Boolean,
    default:false
  },
  refreshToken:{
    type:String
  },
  passwordChangeAt:{
    type:String
  },
  passwordResetToken:{
    type:String
  },
  passwordResetExpires:{
    type:String
  }
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
       next()
    }
    const salt =bcrypt.genSaltSync(10)
    this.password=await bcrypt.hash(this.password,salt)
})
userSchema.methods={
    isCorrectPassword: async function (password){
        return await bcrypt.compare(password,this.password)
    },
    createPasswordChangeToken: function(){
      // hex là hệ thập lục phân
        const resetToken=crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires=Date.now() + 15*60*1000
        return resetToken
    }
}

const User = mongoose.model("User", userSchema); // Đảm bảo tên mô hình là 'User' với chữ cái hoa
module.exports = User;
