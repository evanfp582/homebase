import mongoose from "mongoose";
import Image from "./model/Image.js";
import express from "express";
import cors from "cors"

import dotenv from "dotenv";
dotenv.config({path: '../.env'});

const app = express();
const port = 5000;

app.use(cors());

const data = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
];

app.get("/api/items", (req, res) => {
  res.json(data);
});
 
async function main(){

  const uri = process.env.MONGO_HOST_AND_NAME

  mongoose.connect(uri)

  const pic = await Image.findOne({filename: "20230430_173828.jpg"}).exec();

  console.log(pic);
}

main().catch(console.error);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});