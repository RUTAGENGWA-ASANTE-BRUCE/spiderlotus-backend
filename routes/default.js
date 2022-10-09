import Express from "express";
const router = Express.Router();
const defaultSettings = {
  language: "English",
  currency: "USD",
  location: { country: "Rwanda", city: "Kigali" },
};
router.get("/", (req, res) => {
  res.status(201).send(defaultSettings);
});
router.post("/", (req, res) => {
  defaultSettings.language = req.body.language;
  defaultSettings.currency = req.body.currency;
  defaultSettings.location = req.body.location;
});

export default router;
