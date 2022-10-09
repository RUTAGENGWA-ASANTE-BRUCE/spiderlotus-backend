import Mongoose from "mongoose";
const connection_url = "mongodb://localhost/selling";
import users from "../dbUser.js";
Mongoose.connect(connection_url);

var usersList;

async function fetchUsers() {
  users.find((err, data) => {
    if (err) throw err;
    else {
      usersList = data;
    }
  });
}
fetchUsers();

const myUsers = [
  {
    location: {
      country: "Rwanda",
      city: "Kigali",
    },
    _id: "6257563affab22279cb4f047",
    userName: "Rutagengwa Asante Bruce",
    email: "rutagengwabruce@gmail.com",
    password: "bruce2005",
    language: "English",
    currency: "USD",
    messageRoom: "f2975b81-a9e7-4f1f-a7b5-b08c65daed81",
    cartList: [],
    savedList: [],
    Messages: [],
    notifications: [],
    directPeople: [],
    channels: [],
    __v: 0,
  },
];

export default usersList;
