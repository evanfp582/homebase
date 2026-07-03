# echo "Switching to branch master"
# git checkout main

echo "Buidling app..."
npm run build

echo "Deploying files to server"
scp -r build/* evanf@192.168.0.63:/var/www/192.168.0.63/

echo "Done"