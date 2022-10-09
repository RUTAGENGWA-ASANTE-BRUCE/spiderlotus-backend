import Mongoose from "mongoose";

const userSchema = new Mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  language: String,
  currency: String,
  profilePicture:String,
  location: { country: String, city: String },
  messageRoom: String,
  cartList: [],
  savedList: [],
  messages: [],
  notifications: [],
  directPeople: [],
  channels: [],
});
export default Mongoose.model("users", userSchema);
