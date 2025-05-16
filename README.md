# homebase_storage
Hold media in local Linux server because both google and my C drive is yelling at me to free some space.

## Learning 

### Linus Server
I am learning a bunch of small things. I will document them here so when I get stuck somewhere in teh future I can look back here to get unstuck.  
Activating a Linux venv in python is source venv/bin/activate.  
I learned that OpenCV (understandably) need to use a special verison if you are using an oporating system without a GUI. So that was a little bug that I needed to correct. 

### MongoDB
I am learning how to set up, host, run, and manage a MongoDB  
Not just any MongoDB, but a GridFS MongoDB to store my large photos  

When logged into the Linux server run to run Mongo server.  
```cmd
mongosh
```
I am not sure why mongod or anything else fails, but I will need to correct this eventually.  

### Full stack 
React JS frontend   
Node JS backend with Express JS and Mongoose for MongoDB Schemas and nodemon.  
followed this guide to set up https://www.einfochips.com/blog/building-a-full-stack-application-with-react-js-and-node-js/. 
I have basic website set up 100 times, but I feel like I always follow a different set of commands/guides.  


Getting Mongoose and Node JS to play nicely took this guide https://www.mongodb.com/developer/languages/javascript/getting-started-with-mongodb-and-mongoose/  

### Python
I have written a few scripts 
This new one that I am going to make is super fun-
Since these images are super large, I am going to be making compressed versions of each photo to display on the page and then the real version will be shown if you click on it
I know for sure there exists plenty of avaliable code online to compress an image, BUT, since I just finished my computer vision class, I am going to make my own compressed image by running a filter through the images.
