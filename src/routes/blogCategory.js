const express = require("express");
const router = express.Router();
const ctrls = require('../controllers/blogCategoryController')
const {verifyAccessToken, isAdmin}=require('../middlewares/verifyToken')
router.post('/',[verifyAccessToken,isAdmin],ctrls.createBlogCategory)
router.get('/',[verifyAccessToken,isAdmin],ctrls.getBlogCategory)
router.put('/:pcid',[verifyAccessToken,isAdmin],ctrls.updateBlogCategory)
router.delete('/:pcid',[verifyAccessToken,isAdmin],ctrls.deleteBlogCategory)
module.exports=router