import Mongoose from "mongoose";

const productSchema = new Mongoose.Schema({
    title:String,
    image:String,
    price:Object,
    importFee:Number,
    depositLocation:String,
    amount:Number,
    customizationNumber:String,
    customization:Array,
    productDetails:Array,
    companyDetails:Array,   
    category:String,
})

export default Mongoose.model("products", productSchema)