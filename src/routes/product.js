const express = require("express");
const router = express.Router();
const ctrls = require('../controllers/productController')
const {verifyAccessToken, isAdmin}=require('../middlewares/verifyToken')
router.post('/',[verifyAccessToken,isAdmin],ctrls.createProduct)
module.exports = router;