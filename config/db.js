import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//-- define the mongodb connection url
const mongoURL = process.env.MONGODB_URL_LOCAL || 'mongodb://127.0.0.1:27017/dataNeuron';

// set up a mongodb  connection
mongoose.connect(mongoURL)
  .then(() => {
    console.log("Connected to Mongodb Server");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//get the default connection
// mongoose the maintain the default connection object representing the mongodb connection.
const db = mongoose.connection

//define event listener for database connection
db.on("connected", () => {
  console.log("Connected on Mongodb server")
})

db.on("error", (error) => {
  console.log("Mongodb connection server", error)
})

db.on("disconnected", () => {
  console.log("Mongodb disconnected")
})


export default db;