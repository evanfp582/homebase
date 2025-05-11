# Learn how to manipulate a locally running MondoDB with Python
import pymongo
import os
from dotenv import load_dotenv
import gridfs
from PIL import Image
from io import BytesIO

load_dotenv()

MONGO_HOST = os.getenv("MONGO_HOST")
DATABASE_NAME = os.getenv("DATABASE_NAME")

myclient = pymongo.MongoClient(MONGO_HOST)

gridfsDB = myclient[DATABASE_NAME]
fs = gridfs.GridFS(gridfsDB)

mydb = myclient[DATABASE_NAME]
dblist = myclient.list_database_names()
print(dblist)
if DATABASE_NAME in dblist:
  print("The database exists.")
  # Find the file
  grid_out = fs.find_one({'filename': 'RedneckSafari.jpg'})
  image = Image.open(BytesIO(grid_out.read()))
  image.show()
else:
  print("Nah")