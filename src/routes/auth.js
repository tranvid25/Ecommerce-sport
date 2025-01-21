const express = require("express");
const router = express.Router();
const ctrls = require('../controllers/authControllers')
const {}=require('../middlewares/verifyToken')
router.post('/register',ctrls.register)
router.post('/login',ctrls.login)
module.exports = router;
