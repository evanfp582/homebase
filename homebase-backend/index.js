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

let gfs, thumbnailsCollection;

mongoose.connect(process.env.MONGO_HOST_AND_NAME);

const conn = mongoose.connection;

conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: "fs"
  });
  console.log("GridFS ready");

  thumbnailsCollection = conn.db.collection('thumbnails');
  console.log("thumbnails collection ready");
});

// Route: GET /image/:filename
app.get("/image/:filename", (req, res) => {
  console.log("Getting ", req.params.filename);
  
  const fileStream = gfs.openDownloadStreamByName(req.params.filename);
  fileStream.on("error", () => {
    res.status(404).send("File not found");
  });
  fileStream.pipe(res);
});

// Route: GET /image/id/:fileid
app.get("/image/id/:fileId", (req, res) => {
  console.log("Getting ", req.params.fileId);
  
  const fileStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.fileId));
  fileStream.on("error", () => {
    res.status(404).send("File not found");
  });
  fileStream.pipe(res);
});

app.get("/thumb/id/:originalId", async (req, res) => {
  try {
    console.log("Getting Thumbnail for ID: ", req.params.originalId);
    
    const thumbnailDoc = await thumbnailsCollection
      .findOne({"originalFileId": new mongoose.Types.ObjectId(req.params.originalId)})    
    const buffer = thumbnailDoc.thumbnail.buffer;
    res.setHeader('Content-Type', 'image/jpeg'); // or 'image/png' if you know the format
    res.send(buffer);
    
  } catch (err) {
    res.status(500).send('Error fetching thumbnails');
  }
});
  
app.get('/thumbnails', async (req, res) => {
  try {
    const thumbnails = await thumbnailsCollection
      .find({}, { projection: { thumbnail: 0 } })
      .toArray();
    res.json(thumbnails);
  } catch (err) {
    res.status(500).send('Error fetching thumbnails');
  }
});

app.get("/findall/:limit", async (req, res) => {
  const limit = Number(req.params.limit)
  let results = []
  const cursor = gfs.find({}).limit(limit);
  for await (const doc of cursor) {
    console.log(doc);
    results.push(doc)
  } 
  res.send(results)
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
