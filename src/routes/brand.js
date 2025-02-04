const express = require("express");
const router = express.Router();
const ctrls = require('../controllers/brandController')
const {verifyAccessToken, isAdmin}=require('../middlewares/verifyToken')
router.post('/',verifyAccessToken,ctrls.createBrand)
router.get('/',ctrls.getBrand)
router.put('/:bid',verifyAccessToken,ctrls.updateBrand)
router.delete('/:bid',verifyAccessToken,ctrls.deleteBrand)
module.exports=router