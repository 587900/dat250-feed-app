# feed-app for polling

The following is a feed-app implementation for the DAT250 course at HVL, Norway. The project was completed by group 1.

### Running the project
To run the project, you need to take a few steps. Firstly, make sure you have `npm` (node-package-manager) and `node` installed (available from the node.js website).

You must also have `nodemon` installed:
```
npm install -g nodemon
```
After that, you must set up the configuration for the project:

For client: Set the 'api endpoint' values inside various files inside the 'client' folder. By default it points to `http://localhost:8080`.

For server: Make a copy of the `.env-example` file and name it `.env`. Fill it with the expected values. Details for field values below.

To start the client, do the following inside the 'client' folder:
```
npm install
npm start
```
Likewise, to start the server, do the following inside the 'server' folder:
```
npm install
npm start
```
Note that `npm install` only needs to be run the first time you start the project.

### Deployment
To deploy the application, simply configure it as described in 'Running the project', and run it on a server.

### Server configuration fields
- DB_URL - The mongo url for the database connection to use (mongo://...)
- PORT - The port to start the server on. For the default client configuration on localhost, do PORT=8080
- SESSION_SECRET - Internal secret for API sessions. Can be any string, but ideally long and random
- GOOGLE_CLIENT_ID - For Google-Auth, go to google's developer site and register an oauth2.0 API key. You will be given an ID and a SECRET. Use these here. If you set both to an empty string, the project will function fine but google authentication will not work
- GOOGLE_CLIENT_SECRET - See above
- DWEET_PREFIX - A prefix to append to the url-topics of any dweets. Can be any string, for example 'feed-app-'
- PASSPORT_URL - The passport redirect url/domain for external authentication. Should point back to the same server and port this server is running on. Note that it might have to be registered with external authentication providers for validity (like google, during their oauth2.0 registration step)
- CORS_ORIGIN - The url to allow CORS requests from. Should point to the server/domain providing the client code
- MQTT_URL - (OPTIONAL) If set as an url, then the server will post MQTT events to that server (mqtt://...)