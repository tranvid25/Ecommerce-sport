const express = require("express");
const router = express.Router();
const ctrls = require('../controllers/productController')
const {verifyAccessToken, isAdmin}=require('../middlewares/verifyToken')
router.post('/',[verifyAccessToken,isAdmin],ctrls.createProduct)
router.get('/:pid',ctrls.getProduct)
router.get('/',ctrls.getProducts)
router.put('/ratings',verifyAccessToken,ctrls.ratings)
router.put('/:pid',[verifyAccessToken,isAdmin],ctrls.updateProduct)
router.delete('/:pid',[verifyAccessToken,isAdmin],ctrls.deleteProduct)
module.exports = router;