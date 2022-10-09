import Mongoose from "mongoose";

const ordersSchema = new Mongoose.Schema({
  customer: String,
  customerId: String,
  customerImage: String,
  adress: { country: String, city: String },
  products: [],
  date: String,
  status: String,
  otherDetails: {
    products: [],
    totalItems: Number,
    totalPrice: Number,
    importFee: Number,
    totalCost: Number,
  },
});
export default Mongoose.model("orders", ordersSchema);
