const BlogCategory=require('../models/blogCategory')
const asyncHandler=require('express-async-handler')
const createBlogCategory=asyncHandler(async(req,res)=>{
    const response= await BlogCategory.create(req.body)
    return res.status(200).json({
        success:response ? true : false,
        create:response ? response : 'not response'
    })
})
const getBlogCategory=asyncHandler(async(req,res)=>{
    const response=await BlogCategory.find().select('title -_id')
    return res.status(200).json({
        success:response ? true : false,
        getCategory:response ? response : 'Cannot get product-category'
    })
})
const updateBlogCategory=asyncHandler(async(req,res)=>{
    const{bcid}=req.params
    const response=await BlogCategory.findByIdAndUpdate(bcid,req.body,{new:true})
    return res.status(200).json({
        success:response ? true : false,
        updateCategory:response ? response : 'Cannot update produc-category'
    })
})
const deleteBlogCategory=asyncHandler(async(req,res)=>{
    const{bcid}=req.params
    const response=await BlogCategory.findByIdAndDelete(bcid)
    return res.status(200).json({
        success:response ? true : false,
        deleteCategory:response ? response : 'Cannot delete product-category'

    })
})
module.exports={
    createBlogCategory,
    getBlogCategory,
    updateBlogCategory,deleteBlogCategory
}