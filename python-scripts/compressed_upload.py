# Upload a bunch of 100x100 images to the DB
# You need a "compressed_images" folder located in this directory
import os
import pymongo
import gridfs
from dotenv import load_dotenv
import argparse

load_dotenv()

def connect_to_GridFS():
  """Connect to the Mongo GridFSDB
  Returns:
      GridFSDB: The GridFSDB
  """
  MONGO_HOST = os.getenv("MONGO_HOST")
  DATABASE_NAME = os.getenv("DATABASE_NAME")
  myclient = pymongo.MongoClient(MONGO_HOST)
  gridfsDB = myclient[DATABASE_NAME]
  return gridfsDB

def upload_to_mongo():
  """Upload all the files in the folder to the thumbnails collection in DB
  Args:
      folder (str): _description_
  """
  db = connect_to_GridFS()
  fs = gridfs.GridFS(db)
  thumbnails = db["thumbnails"]
  
  compressed_path = os.path.join("python-scripts", "compressed_images")
      
  for filename in os.listdir(compressed_path):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
      # Check if compressed image exists in DB
      existing = fs.find_one({"filename": filename})
      if existing:
        file_path = os.path.join(compressed_path, filename)
        
        with open(file_path, "rb") as f:
          data = f.read()

          # Prevent duplicates
          existing_compressed = fs.find_one({
              "filename": filename,
              "metadata.compressed": True
          })
          if existing_compressed:
              print(f"Compressed version of '{filename}' already exists. Skipping.")
              continue

          # Upload with metadata to tag as compressed
          thumbnails.insert_one({"thumbnail": data, "originalFileId": existing._id})
          print(f"Uploaded compressed image: {filename}")
      else:
        print(f"Original image not found in thumbnail collection for: {filename}")
        

def parse_args_func():
  """Parse the args:
  """
  parser = argparse.ArgumentParser(description= "Upload to GridFS")
  # parser.add_argument("folder", help="Path to the folder containing files to upload")
  return parser.parse_args()

def main():
  args = parse_args_func()
  # folder = args.folder
  upload_to_mongo()
  
  
if __name__ == "__main__":
  main()