# Import a bunch of files into the GridFS for MongoDB
import os
import sys
import pymongo
from pymongo import MongoClient
import gridfs
from dotenv import load_dotenv
import argparse

load_dotenv()

def connect_to_GridFS():
  """Connect to the Mongo GridFS
  Returns:
      GridFS: The GridFS 
  """
  MONGO_HOST = os.getenv("MONGO_HOST")
  myclient = pymongo.MongoClient(MONGO_HOST)
  gridfsDB = myclient["test"]
  fs = gridfs.GridFS(gridfsDB)
  return fs

def upload_to_mongo(folder: str):
  """Upload all the files in the folder to the GridFS
  Args:
      folder (str): _description_
  """
  fs = connect_to_GridFS()
  
  uploaded_count = 0
  for filename in os.listdir(folder):
    filepath = os.path.join(folder, filename)
    try:
      with open(filepath, 'rb') as f:
        if not fs.find_one({'filename': filename}):
          fs.put(f.read(), filename=filename)
          print(f"Uploaded: {filename}")
          uploaded_count += 1
        else:
            print(f"Skipped (already exists): {filename}")
    except Exception as e:
        print(f"Error uploading {filename}: {e}")
  print(f"Upload complete. Total images uploaded: {uploaded_count}")
    
  

def parse_args_func():
  """Parse the args:
  """
  parser = argparse.ArgumentParser(description= "Upload files in folder to GridFS")
  parser.add_argument("folder", help="Path to the folder containing files to upload")
  return parser.parse_args()

def main():
  args = parse_args_func()
  folder = args.folder
  if not os.path.isdir(folder):
    print(f"Error: Folder '{folder}' does not exist.")
    sys.exit(1)
  upload_to_mongo(folder)
  
  
if __name__ == "__main__":
  main()