import os
from dotenv import load_dotenv
import gridfs
import argparse
import pymongo

load_dotenv()

def default_unique_func():
  return True

def parse_args_function():
  parser = argparse.ArgumentParser(description="Connect to database then upload")
  # TODO
  return parser.parse_args()

def connect_to_database(host, databaseName, isGridFS=False):
  """Connect to the database
  Args:
      host (string): Host name found in .env
      databaseName (string): database name found in .env
      isGridFS (bool, optional): Is this a GridFS transaction. Defaults to False.
  Returns:
      database: Returns a database or GridFS
  """
  myclient = pymongo.MongoClient(host)
  database = myclient[databaseName]
  if isGridFS:
    fs = gridfs.GridFS(database)
    return fs
  else:
    return database


def upload(database, documents, collection_name, unique_func=True, isGridFS=False):
  """Upload documents to MongoDB database
  Args:
      database (database): MongoDB Database
      documents (list): list of dictionaries to upload
      collection_name (string): Name of collection to upload to 
      TODO UNIMPLEMENTED unique_func (bool, optional): _description_. Defaults to True.
      isGridFS (bool, optional): Defaults to False.
  """
  
  myclient = pymongo.MongoClient(host)
  db = myclient[databaseName]
  if isGridFS:
    return gridfs.GridFS(db)
  else:
    return db
  
  if isGridFS:
    # TODO
    return
  else:
    # Just need to do a upload many
    col = database[collection_name]
    log = col.insert_many(documents)
    print(f"Inserted {len(log)} items")
    

def update(database, collection_name, query, newValues, isGridFS=False):
  """Updates a database based on a query to set to new values
  Args:
      database (database): MongoDB Database or GridFS filesystem
      collection_name (string): Name of collection to upload to
      query (dict): Mongo structured object
      newValues (dict): Mongo structured object
      isGridFS (bool, optional): Is the collection GridFS. Defaults to False.
  """
  if isGridFS:
    #TODO ok it seems like GridFS does not like programmatically updating?
    # This is a little confusing because I can mass update GridFS using Mongo compass
    return 
  else:
    return #TODO

def general_mongo_manipulation():
  database = connect_to_database()
  # upload(database, documents, collection_name)
  print("Finished uploading to database!")
  
if __name__ == "__main__":
  MONGO_HOST = os.getenv("MONGO_HOST")
  DATABASE_NAME = os.getenv("DATABASE_NAME")
  
  db = connect_to_database(MONGO_HOST, DATABASE_NAME, True)
  
  update(db, "none", { "filename": "BolandJ_090222_639.jpg" }, {"user": "Evan"}, True)
  
  # arguments = parse_args_function()
  
  # documents = {"Mock": "doc"}
  # collection_name = "mock"
  # general_mongo_manipulation()