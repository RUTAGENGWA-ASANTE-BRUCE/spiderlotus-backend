import Express from "express";
import orders from "../models/ordersModel.js";
import lodash from "lodash";
import Joi from "joi";
import connectMongo from '../utils/connectMongo.js'
connectMongo();

const router = Express.Router();


router.post("/:userId", async (req, res) => {
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
            title: Joi.string().trim(),
            price: Joi.number(),
            quantity: Joi.number(),
            totalPrice: Joi.number(),
            description: Joi.string().trim(),
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

router.get("/", (req, res) => {
    orders.find((err, data) => {
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

export default router;
