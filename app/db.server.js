const mongoose = require("mongoose");
require("../config/db");

const productSchema = mongoose.Schema({
  title: String,
  status: String,
  vendor: String,
});

module.exports = mongoose.model("bulks", productSchema);

// import { PrismaClient } from "@prisma/client";

// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
// }

// export default prisma;
