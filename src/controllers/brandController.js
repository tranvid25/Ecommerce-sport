const Brand=require('../models/brand')
const asyncHandler=require('express-async-handler')
const createBrand=asyncHandler(async(req,res)=>{
    const response=await Brand.create(req.body)
    return res.status(200).json({
        success:response ? true : false,
        createdBrand:response ? response : 'cannot Brand'
    })
})
const getBrand=asyncHandler(async(req,res)=>{
    const response=await Brand.find().select('-_id')
    return res.status(200).json({
        success:response ? true : false,
        getBrand:response ? response : 'canno getBrand'
    })
})
const updateBrand=asyncHandler(async(req,res)=>{
    const {bid}=req.params
    if(Object.keys(req.body).length === 0) throw new Error('missing input')
    const response=await Brand.findByIdAndUpdate(bid,req.body,{new:true})
    return res.status(200).json({
        success:response ? true : false,
        updateBrand:response ? response : 'Cannot updateBrand'
    })
})
const deleteBrand=asyncHandler(async(req,res)=>{
    const{bid}=req.params
    const response=await Brand.findByIdAndDelete(bid)
    return res.status(200).json({
        success:response ? true : false,
        deleteBrand:response ? response : 'cannot deleteBrand'
    })
})
module.exports={
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand
}