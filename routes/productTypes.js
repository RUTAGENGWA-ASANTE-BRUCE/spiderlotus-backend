
import Mongoose from "mongoose";
import Express from "express";
import productTypes from "../models/productTypesModel.js";
import lodash from "lodash";
import Joi from "joi";
const connection_url = "mongodb://localhost/selling";
Mongoose.connect(connection_url);

const router = Express.Router();

router.post("/", async (req, res) => {
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
  
  router.get("/", async (req, res) => {
    productTypes.find((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  });

export default router;
