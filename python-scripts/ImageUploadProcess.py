"""
  ImageUploadProcess
    A full file that combines operations from other files
    Operations include
      Upload a folder of images to the mongoDB
      Make a compressed version of those images
      Upload those compressed version to the database
      
  Simply run
  python ImageUploadProcess.py PATH_OF_IMAGES USER
"""

import argparse
import os
import sys

import cv2
from dotenv import load_dotenv
import gridfs
import numpy as np
import pymongo
import tempfile

load_dotenv()

def parseArgs():
  """Basic function to parse the image folder and user arguments
  Returns:
      Namespace: parsed args
  """
  parser = argparse.ArgumentParser(description="Upload images to the database")
  parser.add_argument("image_folder", help="Path to folder with images to upload")
  parser.add_argument("user", help="User that the images will be saved under")
  return parser.parse_args()

def connectToGridFS():
  """Connect to the Mongo GridFS
  Returns:
      GridFS: GridFS 
      gridfsDB: Database
  """
  MONGO_HOST = os.getenv("MONGO_HOST")
  DATABASE_NAME = os.getenv("DATABASE_NAME")
  myclient = pymongo.MongoClient(MONGO_HOST)
  gridfsDB = myclient[DATABASE_NAME]
  fs = gridfs.GridFS(gridfsDB)
  return fs, gridfsDB

def uploadFullImages(fs: gridfs.GridFS, folder: str, user: str):
  """Upload all the files in the folder to the GridFS
  Args:
      fs (GridFS): File system
      folder (str): path to folder
      user (str): User to associate with images uploaded
  """
  uploadCount = 0
  for filename in os.listdir(folder):
    filepath = os.path.join(folder, filename)
    try:
      with open(filepath, 'rb') as f:
        if not fs.find_one({'filename': filename}):
          fs.put(f.read(), filename=filename, user=user)
          print(f"Uploaded: {filename}")
          uploadCount += 1
        else:
            print(f"Skipped (already exists): {filename}")
    except Exception as e:
        print(f"Error uploading {filename}: {e}")
  print(f"Upload complete. Total images uploaded: {uploadCount}")

def compressImages(imageFolder: str, tempFolder: str):
  """Compress the images found at imageFolder and move them to tempFolder
    Moves a block throughout the image, taking a summation of pixels to compress the image
  Args:
      imageFolder (str): Path to folder with images
      tempFolder (str): Path to temporary folder
  """
  HEIGHT = 100
  WIDTH = 100
  
  imageFiles = [f for f in os.listdir(imageFolder) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
  baseDir = os.path.dirname(__file__)
  uploadCount = 0
  for image in imageFiles:
    imagePath = os.path.join(baseDir, imageFolder, image)
    img = cv2.imread(imagePath, cv2.IMREAD_COLOR)
    
    blockHeight = img.shape[0] // HEIGHT
    blockWidth = img.shape[1] // WIDTH
    
    resizedBGR = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)

    for c in range(3):
      for i in range(HEIGHT):
        for j in range(WIDTH):
          y0, y1 = i * blockHeight, (i + 1) * blockHeight
          x0, x1 = j * blockWidth, (j + 1) * blockWidth
          block = img[y0:y1, x0:x1, c]
          resizedBGR[i, j, c] = np.mean(block).astype(np.uint8)
    
    cv2.imwrite(os.path.join(tempFolder, image), resizedBGR)
    uploadCount += 1
  print(f"Compressed {uploadCount} images")
  
def compressImage(imageData: str):
  """Compress the image data and return it
    Moves a block throughout the image, taking a summation of pixels to compress the image
  Args:
      imageData (str): Image data
  """
  HEIGHT = 100
  WIDTH = 100
  
  npArray = np.fromstring(imageData, np.uint8)
  img = cv2.imdecode(npArray, cv2.CV_LOAD_IMAGE_COLOR)
    
  blockHeight = img.shape[0] // HEIGHT
  blockWidth = img.shape[1] // WIDTH
  
  resizedBGR = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)

  for c in range(3):
    for i in range(HEIGHT):
      for j in range(WIDTH):
        y0, y1 = i * blockHeight, (i + 1) * blockHeight
        x0, x1 = j * blockWidth, (j + 1) * blockWidth
        block = img[y0:y1, x0:x1, c]
        resizedBGR[i, j, c] = np.mean(block).astype(np.uint8)
  
  return resizedBGR

def uploadCompressedImages(fs: gridfs.GridFS, db, folder: str, user: str):
  """Upload the compressed images to the database's thumbnails table
  Args:
      fs (gridfs.GridFS): gridFS file system
      db: The database dictionary
      folder (str): Path to temporary folder that contains the thumbnails 
      user (str): User to associate with thumbnails
  """
  thumbnails = db["thumbnails"]
  for filename in os.listdir(folder):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
      # Check if compressed image exists in DB
      existing = fs.find_one({"filename": filename})
      if existing:
        filePath = os.path.join(folder, filename)
        
        with open(filePath, "rb") as currentFile:
          data = currentFile.read()

          # Prevent duplicates
          existing_compressed = fs.find_one({
              "filename": filename,
              "metadata.compressed": True
          })
          if existing_compressed:
              print(f"Compressed version of '{filename}' already exists. Skipping.")
              continue

          thumbnails.insert_one({"thumbnail": data, "originalFileId": existing._id, "user": user})
          print(f"Uploaded compressed image: {filename}")
      else:
        print(f"Original image not found in thumbnail collection for: {filename}")

def main():
  """
    Workflow supported
    Upload a folder of images to the mongoDB
    Make a compressed version of those images
    Upload those compressed version to the database
  """
  args = parseArgs()
  folder = args.image_folder
  user = args.user
  if not os.path.isdir(folder):
    print(f"Error: Folder '{folder}' does not exist.")
    sys.exit(1)
    
  fs, gridfsDB = connectToGridFS()
  uploadFullImages(fs, folder, user)
  with tempfile.TemporaryDirectory() as tempDir:
    compressImages(folder, tempDir)
    uploadCompressedImages(fs, gridfsDB, tempDir, user)

if __name__ == "__main__":
  main()