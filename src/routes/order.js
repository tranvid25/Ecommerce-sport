const express = require("express");
const router = express.Router();
const {verifyAccessToken, isAdmin}=require('../middlewares/verifyToken');
const ctrls = require("../controllers/orderController");
router.post('/',verifyAccessToken,ctrls.createOrder)
router.put('/status/:oid',[verifyAccessToken,isAdmin],ctrls.updateStatus)
router.get('/',verifyAccessToken,ctrls.getUserOrder)
router.get('/admin',verifyAccessToken,isAdmin,ctrls.getUserOrder)
module.exports=router