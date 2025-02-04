
const Blog=require('../models/blog')
const asyncHandler=require('express-async-handler')
const createBlog=asyncHandler(async(req,res)=>{
    const{title,description,category}=req.body
    if(!title || !description || !category) throw new Error('Missing input')
    const response=await Blog.create(req.body)
    return res.status(200).json({
        success:response ? true : false,
        createBlog:response ? response : 'not response'
    })
})
const updateBlog=asyncHandler(async(req,res)=>{
    const{bid}=req.params
    if(Object.keys(req.body).length === 0) throw new Error('missing input')
    const response=await Blog.findByIdAndUpdate(bid,req.body,{new:true})
    return res.status(200).json({
        success:response ? true : false,
        updateBlog:response ? response : 'not response'
    })
})
const getBlog=asyncHandler(async(req,res)=>{
    const response=await Blog.find().select('-_id')
    return res.status(200).json({
        success:response ? true : false,
        getBlog:response ? response:'not response'
    })
})
const deleteBlog=asyncHandler(async(req,res)=>{
    const{bid}=req.params
    const response=await Blog.findByIdAndDelete(bid)
    return res.status(200).json({
        success:response ? true : false,
        deleteBlog:response ? response : 'not response'
    })
})
//viết logic cho like và dislike bài đăng
// đầu tiên khi mà người dùng like 1 bài blog
// 1 check xem người đó trước đó có dislike hay ko 
const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error('Missing input');

    const blog = await Blog.findById(bid);
    if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id);
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { dislikes: _id } },
            { new: true }
        );
        return res.json({ success: !!response, rs: response });
    }

    const isLiked = blog?.likes?.find(el => el.toString() === _id);
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { likes: _id } },
            { new: true }
        );
        return res.json({ success: !!response, rs: response });
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $push: { likes: _id } },
            { new: true }
        );
        return res.json({ success: !!response, rs: response });
    }
});
const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error('Missing input');

    const blog = await Blog.findById(bid);
    if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const alreadyliked = blog?.likes?.find(el => el.toString() === _id);
    if (alreadyliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { likes: _id } },
            { new: true }
        );
        return res.json({ success: !!response, rs: response });
    }

    const isdisLiked = blog?.dislikes?.find(el => el.toString() === _id);
    if (isdisLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { dislikes: _id } },
            { new: true }
        );
        return res.json({ success: !!response, rs: response });
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $push: { dislikes: _id } },
            { new: true }
        );
        return res.json({ success: !!response, rs: response });
    }
});
const excludeField = '-refreshToken -password -role -createdAt -updatedAt';

const getOneBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;

    // Tìm blog và populate likes và dislikes với excludeField
    const blog = await Blog.findByIdAndUpdate(bid,{$inc:{numberViews:1}},{new:true})
        .populate('likes', excludeField)  // Loại trừ các trường trên likes
        .populate('dislikes', excludeField);  // Loại trừ các trường trên dislikes

    // Kiểm tra và trả về kết quả
    return res.status(200).json({
        success: blog ? true : false,
        rs: blog
    });
});




module.exports={
   createBlog,
   updateBlog,
   getBlog,deleteBlog,
   likeBlog,
   dislikeBlog,
   getOneBlog
}