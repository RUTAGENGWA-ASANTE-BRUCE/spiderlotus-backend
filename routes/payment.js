import Express from "express";
const router = Express.Router();
let paymentData = [];
router.post("/:userId", (req, res) => {
  paymentData = req.body;
  console.log(req.body);
  res.status(201).send(paymentData);
});
router.get("/:userId", (req, res) => {
  res.status(201).send(paymentData);
  console.log(paymentData);
});
export default router;
