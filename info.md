## Info regarding which part of the code does what

This document contains quick info about each component on what it does in order to make it less confusing.<br>
<br>
**THIS DOCUMENT WAS LAST UPDATED AT:** _08-05-2019_

#### App.tsx

This is the top component and is responsible for rendering the entire application<br>
Currently, the main thing it does is check if MetaMask is loaded and signed in.<br>
If yes, then the app will be rendered, if not then an error will be shown.<br>
In the render method, there is a switch statement that determines which loading message gets shown.<br>

#### SiteNavBar.tsx

This component is responsible for rendering the navigation bar at the top of the website.

#### Routing.tsx

Our website consists of several web pages. This component is responsible for rendering the correct web page depending on the current url<br>
For example, if the user goes to `www.localhost:3000.com/create` then we need to show the Match creation page.<br>
Inside render method, the routing is defined.

#### MainArea.tsx

This is the current home page of our website. Currently all it does is display the wallet address of the current MetaMask account.
<br>Nothing else happens here at the moment.

#### MatchCreateAreaLegacy.tsx

This represents the Match creation page. This component is responsible for providing a form that the user can fill in order to create a match.<br><br>
The input will be used to create a match. Some important methods of the component:<br>
* `onSubmit()`: When user clicks 'Create', this method is called. It handles the input and passes it to `createMatch()`.
* `createMatch()`: This is an _async_ method that creates a match by first deploying a new smart contract instance, gettings its contract address and then saving it to database along with match title and creation date.

#### MatchesAreaOldOld.tsx

This component is the Matches page which displays a list of matches along with match details of the selected match.<br>
It consists of a bootstrap grid with match list on the left and match details on the right.
<br><br>When a match is selected it will render a `MatchOverview.tsx` component.<br>

#### MatchOverview.tsx

This component displays details of a match by contacting it's smart contract to ask for details like total bet value.<br>
The parent component that renders this component must pass the database entry (which contains match title and address) of a match as prop.<br>
<br>
This component also allows a user to place his own bet if he is NOT part of the match.<br>
There is also a debug option where you can make a player the winner of that match.<br>
<br>
When it is still loading the match data, it will display a `LoadingCard.tsx` component.<br>
However if an error occurs, it will display a `ErrorCard.tsx` component.
<br><br>
Important methods:
* `getMatchDetails()`: Async method that loads the match details by contacting it's smart contract and requesting data from it. A reference to that contract instance object is stored in the state for further use.
* `onBetSubmit()`: this method is called when User submits a bet. It will disable the submit button and display a loading icon so user can't spam bets. Then it will send a transaction to the smart contract instance.
* `makeMeWinner()`: make the currently logged in MetaMask user win the selected match. That user will recieve the bet money
* `displayForm()`: the betting form should only be displayed if user is not yet part of the match. This method is responsible for handling that. It will be called by the `render()` function.
* `showMainComponent()`: this method is called in `render()`. It will only display the actual component if the match is fully loaded.

#### LoadingCard.tsx

A simple component that display a loading icon with custom message. When rendering this component, you need to pass the following props:
* `text`: the text string that it needs to display as loading message. Example: `"Loading match data..."`.
* `show`: a boolean that tells the component if it should render itself or not.

#### ErrorCard.tsx

A simple component that displays a error message.<br>
When rendering this component, you need to pass the following props:
* `title`: The title of the message Example: `"An error occured during loading!"`.
* `msg`: The error message itself. Example: `"The backend server returned an invalid response during fetch()!"`
* `show`: a boolean that tells the component if it should render itself or not.