const userRouter=require('./auth')
const productRouter=require('./product')
const productCategoryRouter=require('./productCategory')
const BlogCategoryRouter=require('./blogCategory')
const{notFound,errHandler}=require('../middlewares/errHandler')
const initRoutes=(app)=>{
    app.use('/api/user',userRouter)
    app.use('/api/product',productRouter)
    app.use('/api/pc',productCategoryRouter)
    app.use('/api/bc',BlogCategoryRouter)
    app.use(notFound)
    app.use(errHandler)
}
module.exports=initRoutes