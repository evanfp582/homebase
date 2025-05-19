


import argparse
import gridfs
import pymongo

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
      database: Returns a database
  """
  


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
    

def general_mongo_upload():
  database = connect_to_database()
  upload(database, documents, collection_name)
  print("Finished uploading to database!")
  
if __name__ == "__main__":
  arguments = parse_args_function()
  
  documents = {"Mock": "doc"}
  collection_name = "mock"
  general_mongo_upload()