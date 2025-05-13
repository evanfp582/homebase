const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");

dotenv.config({path: '../.env'});
const app = express();
const port = 5000;
app.use(cors());

let gfs;

mongoose.connect(process.env.MONGO_HOST_AND_NAME);

const conn = mongoose.connection;

conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: "fs"
  });
  console.log("GridFS ready");
});

// Route: GET /image/:filename
app.get("/image/:filename", (req, res) => {
  if (!gfs) {
    return res.status(500).send("GridFS not initialized yet");
  }
  console.log("Getting ", req.params.filename);
  
  const fileStream = gfs.openDownloadStreamByName(req.params.filename);
  fileStream.on("error", () => {
    res.status(404).send("File not found");
  });
  fileStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
