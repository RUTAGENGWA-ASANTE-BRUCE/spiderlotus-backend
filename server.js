import Express from "express";
import Cors from "cors";
import Mongoose from "mongoose";
import auth from "./routes/auth.js";
import users from "./dbUser.js";
import orders from "./dbOrders.js";
import config from "config";
import Joi from "joi";
import products from "./dbProducts.js";
import lodash from "lodash";
import productTypes from "./dbProductTypes.js";
// import swaggerJSDoc from "swagger-jsdoc";
import { createRequire } from "module"; 
const require = createRequire(import.meta.url)
const app = Express();
// const swaggerDoc = require("./swagger.json");
app.use(Express.json());
app.use(Cors());
const credentials = config.get("Customer.dbConfig");
const connection_url = credentials.dbName;

app.use("/auth", auth);

Mongoose.connect(connection_url);
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});
app.get("/users", async (req, res) => {
  users.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// app.use(
//   "/api-docs",
//   SwaggerUI.serve,
//   SwaggerUI.setup(swaggerDoc, false, { docExpansion: "none" })
// );
app.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (userId.length == 24) {
    const user = await users.findById(userId);
    res.status(201).send(user);
  }
});

app.post("/users/:userId", async (req, res) => {
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
const defaultSettings = {
  language: "English",
  currency: "USD",
  location: { country: "Rwanda", city: "Kigali" },
};
app.get("/default", (req, res) => {
  res.status(201).send(defaultSettings);
});
app.post("/default", (req, res) => {
  defaultSettings.language = req.body.language;
  defaultSettings.currency = req.body.currency;
  defaultSettings.location = req.body.location;
});
let temporaryData = {};

app.get("/:userId/temporary", (req, res) => {
  res.status(201).send(temporaryData);
});
app.post("/:userId/temporary", (req, res) => {
  temporaryData = req.body;
  res.status(201).send(temporaryData);
});
let paymentData = [];
app.post("/payment/:userId", (req, res) => {
  paymentData = req.body;
  console.log(req.body);
  res.status(201).send(paymentData);
});
app.get("/payment/:userId", (req, res) => {
  res.status(201).send(paymentData);
  console.log(paymentData);
});

app.post("/products/:userId", async (req, res) => {
  const schema = Joi.object().keys({
    name: Joi.string().trim(),
    image: Joi.string().trim(),
    price: Joi.object().keys({
      maximum: Joi.number(),
      minimum: Joi.number(),
    }),
    importFee: Joi.number(),
    depositLocation: Joi.string().trim(),
    amount: Joi.number(),
    customizationNumber: Joi.number(),
    customization: Joi.array().items(Joi.string().trim()),
    productDetails: Joi.array().items(
      Joi.object().keys({
        "Product name": Joi.string().trim(),
        Manufacturer: Joi.string().trim(),
        Functionality: Joi.string().trim(),
        Colors: Joi.string().trim(),
        Origin: Joi.string().trim(),
        Supplier: Joi.string().trim(),
        "Quality Checked by": Joi.string().trim(),
      })
    ),
    companyDetails: Joi.array().items(
      Joi.object().keys({
        company: Joi.string().trim(),
        Location: Joi.string().trim(),
        "Other Products": Joi.string().trim(),
        "Industrial activities": Joi.string().trim(),
        "Contact Info": Joi.string().trim(),
      })
    ),
    category: Joi.string().trim(),
  });
  try {
    const value = await schema.validateAsync(req.body);
    const wanted = lodash.pick(req.body, [
      "name",
      "image",
      "price",
      "importFee",
      "depositLocation",
      "amount",
      "customizationNumber",
      "customization",
      "productDetails",
      "companyDetails",
      "category",
    ]);
    products.create(wanted, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/products", async (req, res) => {
  products.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/products/:userId", async (req, res) => {
  let userId = req.params.userId;
  let user = await users.find();
  if (user) {
    let productDetails = req.body.productDetails;
    try {
      let myProducts = await products.find({ productDetails: productDetails });
      if (myProducts) {
        res.status(201).send(myProducts);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

app.post("/orders/:userId", async (req, res) => {
  const schema = Joi.object().keys({
    customer: Joi.string().trim(),
    customerImage: Joi.string().trim(),
    customerId: Joi.string().min(24).max(24).trim(),
    adress: Joi.object().keys({
      country: Joi.string().trim(),
      city: Joi.string().trim(),
    }),
    products: Joi.array().items(Joi.string().trim()),
    date: Joi.string().trim(),
    status: Joi.string().trim(),
    otherDetails: Joi.object().keys({
      products: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().trim(),
          price: Joi.number(),
          quantity: Joi.number(),
          totalPrice: Joi.number(),
          company: Joi.string().trim(),
          productImage: Joi.string().trim(),
        })
      ),
      totalItems: Joi.number(),
      totalPrice: Joi.number(),
      importFee: Joi.number(),
      totalCost: Joi.number(),
    }),
  });
  try {
    const value = await schema.validateAsync(req.body);
    const wanted = lodash.pick(req.body, [
      "customer",
      "customerImage",
      "customerId",
      "adress",
      "products",
      "date",
      "status",
      "otherDetails",
      "totalItems",
      "totalPrice",
      "importFee",
      "totalCost",
    ]);
    orders.create(wanted, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/productTypes", async (req, res) => {
  const schema = Joi.object().keys({
    mainCategory: Joi.string().trim(),
    minorCategories: Joi.array().items(Joi.array().items(Joi.string().trim())),
  });
  try {
    const value = await schema.validateAsync(req.body);
    const wanted = lodash.pick(req.body, ["mainCategory", "minorCategories"]);
    productTypes.create(wanted, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/productTypes", async (req, res) => {
  productTypes.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
app.get("/orders", (req, res) => {
  orders.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
app.get("/orders/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (userId.length == 24) {
    let allOrders = [];
    orders.find((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res
          .status(201)
          .send(data.filter((order, i) => order.customerId === userId));
      }
    });
  }
});
app.post("/messages", async (req, res) => {
  console.log("messages:", req.body);
});

app.listen(credentials.serverPort, () =>
  console.log(`The server is running on ${credentials.serverPort}...`)
);
