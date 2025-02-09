const mongoose = require('mongoose')
const orderSchema=new mongoose.Schema({
    products:[{
        product:{type:mongoose.Types.ObjectId,ref:'Product'},
        count:Number,
        color:String
    }],
    status:{
        type:String,
        default:'Processing',
        enaum:['Cancelled','Processing','Successed']
    },
    payment:{},
    total:Number,
    coupon:{
        type:mongoose.Types.ObjectId,ref:'Coupon'
    },
    orderBy:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }
})
module.exports=mongoose.model('Order',orderSchema)