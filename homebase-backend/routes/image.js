// https://www.youtube.com/watch?v=OvbRLY1QRIk
const mongoose = require('mongoose')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const sharp = require("sharp");

require('dotenv').config({path: '../.env'});

const mongoURI = process.env.MONGO_HOST_AND_NAME;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}) 

let gfs;
let thumbnailsCollection;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'fs',
  });
  thumbnailsCollection = conn.db.collection("thumbnails");
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 20000000},
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    }
});

function uploadBuffer(buffer, filename, metadata = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = gfs.openUploadStream(filename, {metadata});
    uploadStream.on("error", reject);
    uploadStream.on("finish", () => {
      resolve({
        _id: uploadStream.id,
        filename: uploadStream.filename,
        metadata
      });
    });
    uploadStream.end(buffer);
  });
}

function checkFileType(file, cb) {
  // https://youtu.be/9Qzmri1WaaE?t=1515
  // define a regex that includes the file types we accept
  const filetypes = /jpeg|jpg|png|gif/;
  //check the file extention
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // more importantly, check the mimetype
  const mimetype = filetypes.test(file.mimetype);
  // if both are good then continue
  if (mimetype && extname) return cb(null, true);
  // otherwise, return error message
  cb('filetype');
}

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const originalBuffer = req.file.buffer;
    const originalFile = await uploadBuffer(
        originalBuffer,
        req.file.originalname,
        { user: "Evan"}
    );

    const thumbBuffer = await sharp(originalBuffer)
      .resize({
          width: 100,
          height: 100,
          fit: "cover"
      })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    const thumbResult = await thumbnailsCollection.insertOne({
      originalFileId: originalFile._id,
      user: "Evan",
      thumbnail: thumbBuffer
  });

    res.json({
        original: originalFile._id,
        thumbnail: thumbResult._id
    });

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const deleteImage = (id) => {
  if (!id || id === 'undefined') return res.status(400).send('no image id');
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('image deletion error');
  });
};

// this route will be accessed by any img tags on the front end which have
// src tags like
// <img src="/api/image/123456789" alt="example"/>
// <img src={`/api/image/${user.profilePic}`} alt="example"/>
router.get('/:id', ({ params: { id } }, res) => {
  // if no id return error
  if (!id || id === 'undefined') return res.status(400).send('no image id');
  // if there is an id string, cast it to mongoose's objectId type
  const _id = new mongoose.Types.ObjectId(id);
  // search for the image by id
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).send('no files exist');
    // if a file exists, send the data
    gfs.openDownloadStream(_id).pipe(res);
  });
});

module.exports = router;