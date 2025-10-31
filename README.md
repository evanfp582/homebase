# homebase_storage
Hold media in local Linux server because both google and my C drive is yelling at me to free some space.
This project helps me learn Linux, networking, Mongo, full stack work, design, image manipulation...

## Ideas 
Writrting down ideas I have for this project and putting it front and center so that I get motivated and encouraged to do it!

### Kitchen Recipe Pad
I want to basically take an IPad (I have an old kindle) that I can mount and store in the kitchen that I can send recipes to  
It will always be on and I can scrolls through the recipe  
This is real basic tbh, but I want to host it   
I want the Homebase server to wirelessly send a recipe to the kitchen pad and then the pad will load the recipe botta bing botta boom  
I want to make this in something not named Python or JavaScript because my Github is littered with python and JS projects   

## Learning 

### Linux Server
I am learning a bunch of small things. I will document them here so when I get stuck somewhere in teh future I can look back here to get unstuck.  
Activating a Linux venv in python is source venv/bin/activate.  
I learned that OpenCV (understandably) need to use a special version if you are using an operating system without a GUI. So that was a little bug that I needed to correct. 

I have had a whole lot of difficulties setting up and learning my Ubuntu linux server. Most of the issues relating to internet/ethernet. 
I wrote down my issues at the time, but I did not. I am doing this after the fact  

**How to Set Up Ethernet**  
I think this is supposed to work immediatly, but mine did not  
I had to check that the ethernet was connected with  
```cmd
ip link show
```
Where I learned the name of the device was enp6s0, but I noticed the state was DOWN so I figured that was not correct  
Then I ran `sudo ip link set dev enp6s0` and `sudo netplan apply`  

As for wifi, I do not remmember what I did a while ago, but I guess that is not important now  

## Servces (including the aforementioned Mongo)
This is a new concept for me while working with linux and it keeps biting me  
I keep forgetting to restart the services I need whenver I reboot and it causes errors elsewhere  
Services I use:  
`mongod` - Obviously mongo db  
`dnsmasq` - A local DNS that turns my local IP to the url  
`nginx` - Web hosting  
Ensuring `enp6s0` is actually running because I guess ethernet being on is not default  



### MongoDB
I am learning how to set up, host, run, and manage a MongoDB  
Not just any MongoDB, but a GridFS MongoDB to store my large photos  

When logged into the Linux server run to run Mongo server.  
```cmd
mongosh
```
I am not sure why mongod or anything else fails, but I will need to correct this eventually.  

the way the previously mentioend mongosh works is it allows you to enter commandline input into the background running mongod process  
The way you run the mongod process (if it for whatever reason shut down)  

```cmd
sudo systemctl start mongod
```
and check it with 
```cmd
sudo systemctl status mongod
```
If it giving you errors when starting mongod try manually removing the stale socket file with 
```cmd
sudo rm /tmp/mongodb-27017.sock
```
I am not sure why this does this, this was an error that AI helped me solve :(  

### Full stack 
React JS frontend   
Node JS backend with Express JS and Mongoose for MongoDB Schemas and nodemon.  
followed this guide to set up https://www.einfochips.com/blog/building-a-full-stack-application-with-react-js-and-node-js/.  
I have basic website set up 100 times, but I feel like I always follow a different set of commands/guides.  

Getting Mongoose and Node JS to play nicely took this guide https://www.mongodb.com/developer/languages/javascript/getting-started-with-mongodb-and-mongoose/  

I am hosting this on a local server with Nginx at http://192.168.0.63/

**How to run the site**  
Make sure the backend is running  
Go to the linux server /homebase_storage/homebase-backend/  
Run 
```cmd
Npm run dev
```
You can check if nginx (the tool to help you webhost) is running, but it usually is
```
service nginx status
```
Now it is running at http://192.168.0.63/

**How to update the site**   
In order to update the site you jsut need to rebuild the code and place the new build in the old build spot  
In updated site run  
```
npm run build
```
This updates the ./build folder
Take this folder and place it in the same place but in the linux server ~/projects/homebase_storage/homebase-frontend$


### Python
I have written a few scripts  
This new one that I am going to make is super fun-  
Since these images are super large, I am going to be making compressed versions of each photo to display on the page and then the real version will be shown if you click on it  
I know for sure there exists plenty of available code online to compress an image, BUT, since I just finished my computer vision class, I am going to make my own compressed image by running a filter through the images.

Ok writing this generalized Mongo manipulation script is a bit of a mess.  
I am trying to make it so you can manipulation both GridFS and non-GridFS collections.  
I think it is quite achievable, I just need to organize a bit.  

# Todo List
Gotta love the old trusty todo list to keep track of things to do with this assignment. It worked really well for keeping me on task for my portfolio website, it should be good here too!
## Storage
I want to create a way to keep a view large images to keep google from begging me to upgrade my plan
- [X] MongoDB backend hosted on local linux server
- [X] Use GridFS to store my very large photos
- [X] Hit my images using a NodeJS backend
- [X] Basic React frontend to also get images
- [X] Make thumbnails of each large image
- [X] Be able to view all image names and thumbnails at once
- [X] Once thumbnail is selected, that is when the full size image is loaded
- [ ] Search through images??? Not sure what I even want to search by
- [ ] Maybe I ought to do some actual design now to make it look less ugly perhaps I should sketch out a design that I like  
I think I have this project at a point that I am ok with  
I think it is time to move onto some other, perhaps more fun, projects  

I lied. There is some more technical backend-y stuff that I want to do.  
As of right now you have to upload images manually. I want to add some sort of front end so users (literally just me and maybe my girlfriend) can upload.  
Oh also I mentioned users. I need to add a login with users. Since this is not public (yet?) I only need password.  
- [X] Login   
- [X] Login determines what images you see  

Now that I am moved into a new place and have control of the router, I want to actually host this website so I can view my images from anywhere  
This is a little scary to me because exposing my computer to the big scary World Wide Web, so I need to do some research into safe ways to do this  
- [ ] Webhosting AND security

## Dash Board
A little python script to keep track of the services I have running in the background and ensure they are all up and running.  
MongoDB is the only one right now 
- [X] Get something up and running that displays status
- [ ] Actually make it look good and animated in Linux 
