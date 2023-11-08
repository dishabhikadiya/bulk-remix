const express = require("express");
const images = require("./app/multer/multer");
const app = express();
require("./config/db");
const router = express.Router();
router.post("/callbackUrl", (req, res) => {
  console.log(req.body);
  res.send("Hello, World!");
});
router.post("/images", images);
app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
