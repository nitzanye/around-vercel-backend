require("dotenv").config();
const mongoose = require("mongoose");
const dbName = "test";
const password = process.env.MONGO_ATLAS_PASSWORD;
const uri = `mongodb+srv://admin:${password}@cluster0.spz2prz.mongodb.net/${dbName}`;

mongoose.connect(uri);
