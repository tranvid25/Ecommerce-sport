const express=require("express")
const path = require("path")
const authRoute=require("./routes/auth.js")
require("dotenv").config();
const { GridFsStorage } = require("multer-gridfs-storage");
const app = express();
const port=process.env.PORT || 8888;
const hostname=process.env.HOST_NAME;
const cors = require("cors");
const multer = require("multer")
const connection = require("./config/database.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());
app.use("/v1/auth",authRoute);
const startServer = async () => {
    try {
      await connection();
      const url = process.env.DB_HOST;
      const dbName = process.env.DB_NAME;
      console.log("connected successfully to server");
      app.listen(port, hostname, () => {
        console.log(`App listening at http://${hostname}:${port}`);
      });
    } catch (error) {
      console.log("Error connecting to DB:", error);
    }
  };
  mongoose.set('strictQuery', true);
  
  startServer();