## Installation

Before running the project, several steps have to be taken in order to make it all work.

Before going any further, please confirm that you have the following installed:

* NodeJS with a working NPM
* Python 3.7 with PIP3 (you can check by launching cmd and typing `pip3`)

**FOR WINDOWS USERS:**

Open terminal in the root folder of the project (where your package.json file is) and enter the command `npm install`
<br><br>
This will install all the required npm packages for React
<br><br>
Once that is done, navigate to the /backend folder and execute the `install.bat` file.<br>
This will install the virtual python environment that django will use.
<br><br>
**FOR LINUX/MAC USERS**<br>
The same as above, except you need to run `install` file (the one without `.bat` at the end).
<br>
<br>
If everything ran without any errors. Then your project is ready to go!

## How to run

The project consists of a React front-end and a Django back-end. Both need to be started seperately.
<br>
Please make sure Ganache and MetaMask are configured and running!
<br>
**To start the django back-end:**

FOR WINDOWS: Run the `run.bat` in the backend folder
<br><br>
FOR LINUX/MAC: Make sure the `run` file (no file extension) and run it.

**To start the React front-end:**

Open the root project folder in your terminal and run `truffle compile` and `npm run start`.
<br><br>
You do not need to run `truffle migrate`.

## Making API calls to backend

The Django backend is just a basic webserver with a REST API. Within React, you can make api calls using the Javascript fetch function.
<br>In database.js at the src folder, you can see examples.
<br>
The API has the following endpoints:<br>
* `/api/matches` - Returns all matches in the database
* `/api/matches/create` - Allows you to create a match by doing a POST request
* `/api/matches/<match_id>` - Allows you to view, edit, delete a match. Replace <match_id> with the actual id number
<br>

**Creating a match**<br>

When creating a match, you need to send a POST request to `/api/matches/create` with the following data in the body:<br>

* title
* contract_address
* start_date (YYYY-MM-DD)
* start_date (YYYY-MM-DD)

**Editing/Deleting a match**
<br><br>
If you want to delete or edit an existing match, you need to use the `/api/matches/<match_id>` endpoint.<br><br>
Sending a DELETE request to that endpoint will delete it.<br><br>
Sending a PUT request that contains the new object data in the body will replace it.
