const express = require("express");
const router = express.Router();
const ctrls = require('../controllers/productCategoryController')
const {verifyAccessToken, isAdmin}=require('../middlewares/verifyToken')
router.post('/',[verifyAccessToken,isAdmin],ctrls.createCategory)
router.get('/',[verifyAccessToken,isAdmin],ctrls.getCategory)
router.put('/:pcid',[verifyAccessToken,isAdmin],ctrls.updateCategory)
router.delete('/:pcid',[verifyAccessToken,isAdmin],ctrls.deleteCategory)
module.exports=router