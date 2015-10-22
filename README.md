###Before you begin
Remember to run npm install in the root folder and bower install on the client folder to get all the required packages.

    npm install
    cd client
    bower install

If you have not installed bower, install it globally by running the following command:

    sudo npm install -g bower

###Application Structure
The application is divided into two main folders:
- client: contains the frontend of the application (the angular part).
- server: contains the backend of the application (the endpoints written using express / mongoose).

###Starting the application
If you don't have nodemon installed, install it globally typing the following command in a terminal window:

    sudo npm install -g nodemon

And run the application from the root folder by typing:

    nodemon

###Folders
There are 4 folders (for now) on the both client and server applications:
1. home: contains all the files related to the home page (questions) functionality.
2. auth: contains all the files related to authentication and authorization functionality.
3. rts: contains all the files related to the RTS room, excluding the WebRTC functionality.
4. webrtc: contains all files related to the WebRTC functionality (excluding the RTS room).
