const Order=require('../models/order')
const User=require('../models/User')
const Coupon=require('../models/coupon')
const asyncHandler=require('express-async-handler')
const createOrder=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    const{coupon}=req.body
    const userCart=await User.findById(_id).select('cart').populate('cart.product','title price')
    let products=userCart?.cart?.map(el=>({
        product:el.product._id,
        count:el.quantity,
        color:el.color
    }))
    let total=userCart?.cart?.reduce((sum,el)=>el.product.price * el.quantity+sum , 0)
    const createData={products,total,orderBy:_id}
    if(coupon){
        const selectedCoupon=await Coupon.findById(coupon)
        total=Math.round(total*(1- +selectedCoupon?.discount/100)/1000)*1000 || total
        createData.total=total
        createData.coupon=coupon
    }
    const rs=await Order.create(createData)
    return res.status(200).json({
        success:rs ? true : false,
        createOrder:rs  ? rs  : 'Cannot create new cart'
    })
})
const updateStatus=asyncHandler(async(req,res)=>{
    const{oid}=req.params;
    const{status}=req.body
    if(!status) throw new Error('Missing input')
    const response=await Order.findByIdAndUpdate(oid,{status},{new:true})
    return res.status(200).json({
        success:response?true:false,
        updateStatus:response ? response : 'cannot update status'
    })    
})
const getUserOrder=asyncHandler(async(req,res)=>{
    const{_id}=req.user
    const response=await Order.find({orderBy:_id})
    return res.status(200).json({
        success:response ? true : false,
        getUserOrder:response?response : 'cannot get UserOrder'
    })
})
const getAllOrder=asyncHandler(async(req,res)=>{
    const response=await Oder.find()
    return res.status(200).json({
        success:response?true: false,
        getALL:response?response:'Cannot get all user'
    })
})
module.exports={
    createOrder,
    updateStatus,getUserOrder,
    getAllOrder
}