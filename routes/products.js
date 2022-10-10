import Express from "express";
import products from "../models/productsModel.js";
import lodash from "lodash";
import users from "../models/userModel.js";
import Joi from "joi";
import connectMongo from '../utils/connectMongo.js'
connectMongo();

const router = Express.Router();

router.post("/:userId", async (req, res) => {
    const schema = Joi.object().keys({
      title: Joi.string().trim(),
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
          description: Joi.string().trim(),
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
  
  router.get("/", async (req, res) => {
    products.find((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  });
  
  router.get("/:userId", async (req, res) => {
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
  export default router;
