import Express from "express";
import users from "../models/userModel.js";
import lodash from "lodash";
import Joi from "joi";
import connectMongo from '../utils/connectMongo.js'
connectMongo();
const router = Express.Router();
router.get("/", async (req, res) => {
  users.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});


router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (userId.length == 24) {
    const user = await users.findById(userId);
    res.status(201).send(user);
  }
});

router.post("/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (userId.length == 24) {
    const user = await users.findById(userId);

    const schema = Joi.object().keys({
      userName: Joi.string().trim(),
      email: Joi.string().email().trim(),
      password: Joi.string().min(5).max(10),
      language: Joi.string().trim(),
      currency: Joi.string().trim(),
      profilePicture: Joi.string(),
      location: Joi.object(),
      messageRoom: Joi.string().trim(),
      cartList: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().trim(),
          price: Joi.number(),
          quantity: Joi.number(),
          totalPrice: Joi.number(),
          company: Joi.string().trim(),
          productImage: Joi.string().trim(),
        })
      ),
      savedList: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().trim(),
          price: Joi.number(),
          quantity: Joi.number(),
          totalPrice: Joi.number(),
          company: Joi.string().trim(),
          productImage: Joi.string().trim(),
        })
      ),
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
      ),
      notifications: Joi.array(),
      directPeople: Joi.array().items(
        Joi.object().keys({
          userName: Joi.string().trim(),
          profilePicture: Joi.string().trim(),
          email: Joi.string().email().trim(),
          _id: Joi.string().min(24).max(24).trim(),
          messageRoom: Joi.string().trim(),
        })
      ),
      channels: Joi.array(),
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
      const properties = Object.keys(wanted);
      console.log(properties);
      properties.map(async (property) => {
        if (Array.isArray(wanted[property])) {
          console.log("Reached here");
          const alreadyInCart = lodash.filter(
            user[property],
            (product) =>
              product.name == wanted[property][0].name &&
              product.productImage == wanted[property][0].productImage &&
              product.company == wanted[property][0].company &&
              product.price == wanted[property][0].price
          );
          console.log(alreadyInCart.length);
          if (property == "cartList" || property == "savedList") {
            wanted[property].map((one) => {
              user[property].length > 0
                ? user[property].map((product, i) => {
                    // console.log("wanted====\n\n",one)
                    // console.log("product====\n\n",product)
                    if (lodash.isEqual(product, one)) {
                      const newCartList = user[property].filter(
                        (product) => !lodash.isEqual(product, one)
                      );
                      console.log(
                        "property============\n============\n",
                        property
                      );
                      user[property] = newCartList;
                    } else {
                      let toBeUpdated = lodash.find(
                        user[property],
                        (product) => {
                          if (
                            product.name == one.name &&
                            product.company == one.company &&
                            product.image == one.image &&
                            product.price == one.price
                          ) {
                            return product;
                          }
                        }
                      );
                      if (toBeUpdated) {
                        user[property].filter((product) =>
                          lodash.isEqual(product, toBeUpdated)
                        )[0] = one;
                      } else {
                        user[property].push(one);
                      }
                    }
                  })
                : user[property].push(one);
            });
          } else {
            wanted[property].map((one) => {
              user[property].push(one);
            });
          }
        } else {
          user[property] = wanted[property];
        }
      });
    } catch (error) {
      return res.status(500).send(error);
    }

    await user.save((err, update) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(201).send(req.body);
      }
    });
  }
});

export default router;