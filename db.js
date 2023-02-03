require("dotenv").config();
const mongoose = require("mongoose");
const dbName = "test";
const password = process.env.MONGO_ATLAS_PASSWORD;
const uri = `mongodb+srv://admin:${password}@cluster0.spz2prz.mongodb.net/${dbName}`;

//const uri = `mongodb+srv://admin:adminAtlasPass@cluster0.spz2prz.mongodb.net/${dbName}`;
mongoose.connect(uri);

//const uri = `mongodb+srv://admin:${process.env.MONGO_ATLAS_PASSWORD}@cluster.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// mongodb+srv://<username>:<password>@cluster0.spz2prz.mongodb.net/test
