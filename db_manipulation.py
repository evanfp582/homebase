# Learn how to manipulate a locally running MondoDB with Python
import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_HOST = os.getenv("MONGO_HOST")
DATABASE_NAME = os.getenv("DATABASE_NAME")

myclient = pymongo.MongoClient(MONGO_HOST)



mydb = myclient[DATABASE_NAME]
dblist = myclient.list_database_names()
print(dblist)
if DATABASE_NAME in dblist:
  print("The database exists.")
else:
  print("Nah")