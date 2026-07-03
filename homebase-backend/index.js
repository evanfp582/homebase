const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const dotenv = require("dotenv");
const cors = require("cors");
const { GridFSBucket } = require("mongodb");
const { GridFsStorage } = require("multer-gridfs-storage");
const { Readable } = require("stream");

dotenv.config({path: '../.env'});
const app = express();
const port = 5000;
app.use(cors());

let gfs, thumbnailsCollection, upload;

mongoose.connect(process.env.MONGO_HOST_AND_NAME);

const conn = mongoose.connection;

conn.once("open", async () => {
  console.log("MongoDB connected");

  gfs = new GridFSBucket(conn.db, {
    bucketName: "fs",
  });

  thumbnailsCollection = conn.db.collection("thumbnails");
  console.log("GridFS and thumbnails collection ready");

  // Set up multer-gridfs-storage after Mongo is connected
  const storage = new GridFsStorage({
    url: process.env.MONGO_HOST_AND_NAME,
    file: async (req, file) => {
      return {
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: "fs",
        metadata: {} // Safe: nothing depends on req.body
      };
    }
  });

  upload = multer({ storage });
});

/*
Routes relating to full sized images in the Mongo GridFS
*/
// Route: GET /image/:filename
app.get("/image/:filename", (req, res) => {  
  const fileStream = gfs.openDownloadStreamByName(req.params.filename);
  fileStream.on("error", () => {
    res.status(404).send("File not found");
  });
  fileStream.pipe(res);
});

// Route: GET an image by fileId
app.get("/image/id/:fileId", (req, res) => {  
  const fileStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.fileId));
  fileStream.on("error", () => {
    res.status(404).send("File not found");
  });
  fileStream.pipe(res);
});

app.post("/uploadImages", (req, res, next) => {
  if (!upload) {
    return res.status(503).send("Storage not initialized yet. Try again soon.");
  }

  upload.array("images")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).send("Error uploading images");
    }

    console.log("Uploaded:", req.files);

    res.status(200).json({
      message: "Images uploaded successfully!",
      files: req.files,
    });
  });
});

// Route: GET all images with a limit of 10
// app.get("/findall/:limit", async (req, res) => {
//   const limit = Number(req.params.limit)
//   let results = []
//   const cursor = gfs.find({}).limit(limit);
//   for await (const doc of cursor) {
//     results.push(doc)
//   } 
//   res.send(results)
// });

// Route: GET all images that belong to user
app.get("/findall/:user", async (req, res) => {
  const user = req.params.user
  console.log("Get all images belonging to ", user);
  let results = []
  const cursor = gfs.find({"user": user});
  for await (const doc of cursor) {
    results.push(doc)
  } 
  res.send(results)
});

/*
Routes relating to getting thumbnails 
*/
// Route: GET a thumbnail by Id of original photo
app.get("/thumb/id/:originalId", async (req, res) => {
  try {    
    const thumbnailDoc = await thumbnailsCollection
      .findOne({"originalFileId": new mongoose.Types.ObjectId(req.params.originalId)})    
    const buffer = thumbnailDoc.thumbnail.buffer;
    res.setHeader('Content-Type', 'image/jpeg'); // or 'image/png' if you know the format
    res.send(buffer);
    
  } catch (err) {
    res.status(500).send('Error fetching thumbnails');
  }
});

// Route: GET all thumbnails
app.get('/thumbnails', async (req, res) => {
  try {
    const thumbnails = await thumbnailsCollection
      .find({})
      .toArray();
    res.json(thumbnails);
  } catch (err) {
    res.status(500).send('Error fetching thumbnails');
  }
});

// Route: GET all thumbnails belonging to user
app.get('/thumbnails/:user', async (req, res) => {
  try {
    const user = req.params.user
    console.log("Username: ", user);
    
    const thumbnails = await thumbnailsCollection
      .find({"user": user})
      .toArray();
    res.json(thumbnails);
  } catch (err) {
    res.status(500).send('Error fetching thumbnails');
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
