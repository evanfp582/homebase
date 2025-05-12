import mongoose from "mongoose";
const { Schema, model } = mongoose;

const imageSchema = new Schema({
  filename: String,
  chunkSize: Number,
  length: Number,
  uploadDate: Date
});

const Image = mongoose.model("Image", imageSchema, "fs.files"); // Make sure to match collection name
export default Image