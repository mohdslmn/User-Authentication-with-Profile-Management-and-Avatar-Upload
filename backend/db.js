const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL ;
mongoose.connect(MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});
const db = mongoose.connection;

db.on('connected',() =>{
    console.log("connected to db server")
});
db.on('error',() => {
    console.log("Mongodb Connection error:")
});
db.on('disconnection',() => {
    console.log("MongoDB Disconnected")
});

module.exports = db;