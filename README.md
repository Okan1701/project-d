## Installation

Before running the project, several steps have to be taken in order to make it all work.

Before going any further, please confirm that you have the following installed:

* NodeJS with a working NPM
* Python 3.7 with PIP3 (you can check by launching cmd and typing `pip3`)

#####FOR WINDOWS USERS:

Open terminal in the root folder of the project (where your package.json file is) and enter the command `npm install`
<br><br>
This will install all the required npm packages for React
<br><br>
Once that is done, navigate to the /backend folder and execute the `install-venv.bat` file.<br>
This will install the virtual python environment that django will use.
<br><br>

If everything ran without any errors. Then your project is ready to go!

## How to run

The project consists of a React front-end and a Django back-end. Both need to be started seperately.
<br>
Please make sure Ganache and MetaMask are configured and running!
<br>
#####To start the django back-end:

FOR WINDOWS: Run the `run.bat` in the backend folder
<br><br>
FOR LINUX/MAC: <br>
Open the terminal in the backend folder and execute the following commands in the terminal:<br>

`source /venv/Scripts/activate`
<br>
`python manage.py runserver`

#####To start the React front-end:

Open the root project folder in your terminal and run `truffle compile` and `npm run start`.
<br><br>
You do not need to run `truffle migrate`.