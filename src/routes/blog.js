const express = require("express");
const router = express.Router();
const {verifyAccessToken,isAdmin}=require('../middlewares/verifyToken')
const uploader=require('../config/cloudinary.config')
const ctrls=require('../controllers/blogController')
router.post('/',[verifyAccessToken],ctrls.createBlog)
router.put('/:bid',[verifyAccessToken,isAdmin],ctrls.updateBlog)
router.delete('/:bid',[verifyAccessToken,isAdmin],ctrls.deleteBlog)
router.get('/',ctrls.getBlog)
router.put('/likes/:bid',verifyAccessToken,ctrls.likeBlog)
router.put('/dislikes/:bid',verifyAccessToken,ctrls.dislikeBlog)
router.get('/getone/:bid',verifyAccessToken,ctrls.getOneBlog)
router.put('/uploadimage/:bid',[verifyAccessToken,isAdmin],uploader.single('image'),ctrls.uploadImagesBlog)
module.exports=router