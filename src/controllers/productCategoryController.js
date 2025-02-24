const ProductCategory=require('../models/productCategory')
const asyncHandler=require('express-async-handler'
)
const createCategory=asyncHandler(async(req,res)=>{
    const response= await ProductCategory.create(req.body)
    return res.status(200).json({
        success:response ? true : false,
        create:response ? response : 'not response'
    })
})
const getCategory=asyncHandler(async(req,res)=>{
    const response=await ProductCategory.find().select('title _id')
    return res.status(200).json({
        success:response ? true : false,
        getCategory:response ? response : 'Cannot get product-category'
    })
})
const updateCategory=asyncHandler(async(req,res)=>{
    const{pcid}=req.params
    const response=await ProductCategory.findByIdAndUpdate(pcid,req.body,{new:true})
    return res.status(200).json({
        success:response ? true : false,
        updateCategory:response ? response : 'Cannot update produc-category'
    })
})
const deleteCategory=asyncHandler(async(req,res)=>{
    const{pcid}=req.params
    const response=await ProductCategory.findByIdAndDelete(pcid)
    return res.status(200).json({
        success:response ? true : false,
        deleteCategory:response ? response : 'Cannot delete product-category'

    })
})
module.exports={
    createCategory,
    getCategory,
    updateCategory,deleteCategory
}