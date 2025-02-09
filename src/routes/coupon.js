const express = require("express");
const router = express.Router();
const ctrls = require('../controllers/couponController')
const {verifyAccessToken, isAdmin}=require('../middlewares/verifyToken')
router.post('/',verifyAccessToken,ctrls.createCoupon)
router.get('/',ctrls.getCoupon)
router.put('/:cid',verifyAccessToken,ctrls.updateCoupon)
router.delete('/:cid',verifyAccessToken,ctrls.deleteCoupon)
module.exports=router