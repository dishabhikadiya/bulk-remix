const multer = require("multer");
const path = require("path");
const imagedata = path.join("uploads/");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagedata);
  },
  filename: (req, file, cb) => {
    cb(null, file.fileName + "-" + Date.now() + file.originalname);
  },
});
const imageuplodes = multer({ storage: storage }).single("images");
module.exports = imageuplodes;
