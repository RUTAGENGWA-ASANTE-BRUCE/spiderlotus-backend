import Mongoose from "mongoose";

const productTypeSchema = new Mongoose.Schema({
    mainCategory: String,
    minorCategories:Array,
})

export default Mongoose.model("product_types", productTypeSchema);