const nodemailer=require('nodemailer')
const asyncHandler=require('express-async-handler')

const sendMail=asyncHandler(async({email,html})=>{
    let transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL_APP,
            pass:process.env.EMAIL_APP_PASSWORD,
        }
    });
    let info=await transporter.sendMail({
        from:'"E-commerceSport" <no-rel@cuahangthethao.com>',
        to:email,
        subject:"Forgot password",
        html:html
    })
    return info
})
module.exports=sendMail