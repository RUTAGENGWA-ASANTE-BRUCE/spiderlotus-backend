import Express from "express";
const router = Express.Router();
let temporaryData = {};

router.get("/:userId", (req, res) => {
  res.status(201).send(temporaryData);
});
router.post("/:userId", (req, res) => {
  temporaryData = req.body;
  res.status(201).send(temporaryData);
});

export default router;
