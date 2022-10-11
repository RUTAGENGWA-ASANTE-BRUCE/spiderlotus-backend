import Express from "express";
import users from "../models/userModel.js";
import bcrypt from "bcrypt";
import lodash from "lodash"
import Joi from "joi"
import JWT from "jsonwebtoken";
import connectMongo from '../utils/connectMongo.js'
connectMongo();

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

const router = Express.Router();
router.post("/login", async (req, res) => {
  const schema=Joi.object().keys({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).max(16).required(),
  })
  try {
    const value = await schema.validateAsync(req.body);
    console.log(value);
    const wanted = lodash.pick(req.body, [
      "email",
      "password"])

    let user = usersList.find((user) => {
      return user.email === wanted.email;
    });
    if (user) {
  let passwordComparison = await bcrypt.compare(
    wanted.password,
    user.password
  );
   if(passwordComparison){
     const token = JWT.sign(
       {
         userId: user._id,
        },
        "awegdrhtyghxztxycuvibyzxjklgtgzmxhcjkgdxcidxkl",
        {
          expiresIn: 259200000,
        }
        );
        console.log(token);
        res.status(201).json({ token: token });
      }
      else{
        return res.status(201).json({
          errorMsg: "Incorrect password",
    });
      }
  } else {
    return res.status(201).json({
          errorMsg: "Invalid userName or email or password",
    });
  }
}
catch (error) {
  return res.status(500).json({
        errorMsg: "Invalid token",
  });
}
});
router.get("/last",async (req, res) => {
  users.find((err, data) => {
    if(err){res.status(500).send(err)}
    else{
      let messages =[]
      data.map((user)=>{user.messages.map((message)=>{messages.push(message)})})
      let only=messages.filter((message)=>message._id==="625afb0cc55571560dd449a6" && message.receiverId==="625c95f7787f3ff4068f24ae")
      res.status(201).send(only[only.length-1])
    }
  })
})

router.post("/signup", async (req, res) => {
  const schema = Joi.object().keys({
    userName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).max(16).required(),
    language: Joi.string().trim().required(),
    currency: Joi.string().trim().required(),
    profilePicture: Joi.string().required(),
    location: Joi.object().keys({country:Joi.string().trim(),city:Joi.string().trim()}).required(),
    messageRoom: Joi.string().trim().required(),
    cartList: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().trim(),
        price: Joi.number(),
        quantity: Joi.number(),
        totalPrice: Joi.number(),
        description: Joi.string().trim(),
        image: Joi.string().trim(),
      })
    ).required(),
    savedList: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().trim(),
        price: Joi.number(),
        quantity: Joi.number(),
        totalPrice: Joi.number(),
        description: Joi.string().trim(),
        image: Joi.string().trim(),
      }),
    ).required(),
    messages: Joi.array().items(
      Joi.object().keys({
        sender: Joi.string().trim(),
        _id: Joi.string().min(24).max(24).trim(),
        profilePicture: Joi.string().trim(),
        senderId: Joi.string().trim(),
        receiverId: Joi.string().min(24).max(24).trim(),
        message: Joi.string().trim(),
        room: Joi.number(),
        timeStamp: Joi.string().trim(),
      })
    ).required(),
    notifications: Joi.array().required(),
    directPeople: Joi.array().items(
      Joi.object().keys({
        userName: Joi.string().trim(),
        profilePicture: Joi.string().trim(),
        email: Joi.string().email().trim(),
        _id: Joi.string().min(24).max(24).trim(),
        messageRoom: Joi.string().trim(),
      })
    ),
    channels: Joi.array().required(),
  });
  try {
    const value = await schema.validateAsync(req.body);
    console.log(value);
    const wanted = lodash.pick(req.body, [
      "userName",
      "email",
      "password",
      "language",
      "currency",
      "profilePicture",
      "location",
      "messageRoom",
      "cartList",
      "savedList",
      "messages",
      "notifications",
      "directPeople",
      "channels",
    ]);

    
  let user = usersList.find((user) => {
    return user.email === wanted.email;
  });
  if (user) {
    return res.status(201).json({
          errorMsg: "This user already exists",
    });
  } else {
    //JWT=header+payload+secret
    //header is sort of increptedData
    //payload is text that we want to be contained in our JWT
    //create token
    let hashedPassword = await bcrypt.hash(wanted.password, 10);
    wanted.password = hashedPassword;
    users.create(wanted, async (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        const token = JWT.sign(
          {
            userId: await data._id,
          },
          "awegdrhtyghxztxycuvibyzxjklgtgzmxhcjkgdxcidxkl",
          {
            expiresIn: 259200000,
          }
        );
        return res.status(201).json({ token: token });
      }
    });
  }
}
catch(error){
  return res.status(500).send(error);
}
});
router.post("/token", async (req, res) => {
  try {
    let userId = await JWT.verify(
      req.body.token,
      "awegdrhtyghxztxycuvibyzxjklgtgzmxhcjkgdxcidxkl"
    ).userId;
    res.status(201).json({ userId: userId });
  } catch (error) {
    return res.status(500).json({
          errorMsg: "Invalid token",
    });
  }
});

const user={
  userName:"bruce",
  password:"43567tui87",
  email:"bruce@gmail.com",
  profilePicture:"hello.jpg",
  currency:"USD",
  language:"English",
  location:{country:"Rwanda", city: "Kigali"},
  cartList:["robot","toys"],
  messageRoom:"urfvgkhgcvbhvncwlkikvkm3w",
  savedList: ["hello","products"],
  messages:["hello bruce","wa kint w"],
  notifications:["new products!!","go to see"],
  directPeople:['george',"giovanni","gilbert"],
  channels:["slack","rca"]
}
router.post("/lodash",async (req, res)=>{
   const schema=Joi.object().keys({
     userName:Joi.string().trim(),
     email:Joi.string().email().trim(),
     password:Joi.string().min(5).max(10),
     language:Joi.string().trim(),
     currency:Joi.string().trim(),
     profilePicture:Joi.string(),
     location:Joi.object(),
     messageRoom:Joi.string().trim(),
     cartList:Joi.array(),
     savedList: Joi.array(),
     messages: Joi.array(),
     notifications: Joi.array(),
     directPeople: Joi.array(),
     channels: Joi.array(),    
   })
   try {
    const value=await schema.validateAsync(req.body)
    // console.log(value)
    const wanted= lodash.pick(req.body,["userName","email","password","language","currency","profilePicture","location","messageRoom","cartList","savedList","messages","notifications","directPeople","channels"])
    const properties= Object.keys(wanted);
    console.log("Wanted",wanted)
    properties.map((property)=>{
      if(Array.isArray(wanted[property])){
        wanted[property].map((one)=>{
          console.log("reached here",user[property])
          user[property].push(one)
        })
      }
      else{
        console.log("down here reache",user[property])
        user[property]=wanted[property]
      }
    })
    // console.log("================data=========\n\n",wanted)
    res.status(201).send(user);
   } catch (error) {
    console.log(error)
    res.send(`an error occures\n\n ${error}`)
   }

})

export default router;
