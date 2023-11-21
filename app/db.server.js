const mongoose = require("mongoose");
require("../config/db");

const productSchema = mongoose.Schema({
  title: String,
  status: String,
  vendor: String,
});
let Users;
try {
  Users = mongoose.model("bulks");
} catch (error) {
  Users = mongoose.model("bulks", productSchema);
}

module.exports = Users;

// import { PrismaClient } from "@prisma/client";

// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
// }

// export default prisma;
