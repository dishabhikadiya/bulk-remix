const mongoose = require("mongoose");
const dbUri =
  "mongodb+srv://disha:disha@cluster0.mvi6yat.mongodb.net/formData?authSource=admin&replicaSet=atlas-bh0ckl-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("mongodb connected!");
  })
  .catch(() => {
    console.log("error");
  });
