const express = require("express");
const router = express.Router();
const ctrls = require('../controllers/authControllers')
const {verifyAccessToken, isAdmin}=require('../middlewares/verifyToken')
router.post('/register',ctrls.register)
router.post('/login',ctrls.login)
router.get('/getone',verifyAccessToken ,ctrls.getOne)
router.post('/refreshtoken',ctrls.refreshAccessToken)
router.get('/logout',ctrls.logout)
router.get('/forgotpassword',ctrls.forgotPassword)
router.put('/resetpassword',ctrls.resetPassword)
router.get('/',[verifyAccessToken,isAdmin],ctrls.getUsers)
router.delete('/',[verifyAccessToken,isAdmin],ctrls.deleteUser)
router.put('/',verifyAccessToken,ctrls.updateUser)
router.put('/address',verifyAccessToken,ctrls.updateUserAddress)
router.put('/cart',verifyAccessToken,ctrls.updateCart)
router.put('/:uid',verifyAccessToken,isAdmin,ctrls.updateUserByid)
module.exports = router;
