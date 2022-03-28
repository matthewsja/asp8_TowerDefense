# asp8_TowerDefense
A Tower Defense game for Agile Software Programming Group 8. 

This is the code repository. 

--------------------------------------------------
# For Teachers - 

<b>Game link: https://aspgrp8.z1.web.core.windows.net/ </b>

<b>Peripheral files can be found here: https://github.com/FredaXYu/ASP_Group8 </b>

<b>Final proposal (please find the latest version): https://github.com/FredaXYu/ASP_Group8/tree/main/after_midterm/finalterm_proposal </b>

--------------------------------------------------

### Members:
Alex Chu

Dimitri Vlachos

Jeremy Matthews

Freda Xiaoyun Yu

(Absent: Sharif Khan)

--------------------------------------------------

# For Developers - 
## Developer Setup

Because of the nature of Phaser, and writing games with JavaScript, the game will need a web server to be able to be tested during development.  There are a few tools that can be used to help streamline this process.  Brackets and Visual Studio Code both have the ability to run a local web server for easy testing of the game.  This project can also make use of NodeJS to run a small local web server.

### NodeJS

Install the current LTS version of NodeJS from [here](https://nodejs.org/en/) (16.13.2 at time of writing).  Once node is installed, through a command prompt, navigate to the projects root directory and run `npm install` to install all of the NodeJS Dependencies.

With a command prompt in the projects root directory, run `npm run start`.  This will launch a local web server for the project.  In a web browser, you will be able to navigate to `http://127.0.0.1:8080/` to play the game locally.

## IDEs

Both Brackets and Visual Studio Code make excellent code editors for JavaScript and both have the ability to run a test web server in the background for easy testing during development.

### Brackets

Brackets can be used for development.  It is a great cross platform IDE and it has Live Preview built in by default.  It can be downloaded [here](https://brackets.io/).

### Visual Studio Code

Visual Studio Code is an excellent, cross platform IDE which has many extensions which can help with development.  It does not have a Live Preview feature built in, but does have the ability to add one through the use of Extensions.  VSCode can be downloaded from [here](https://code.visualstudio.com/) and is regularly updated.  For easy development, I recommend installing a few extensions.

1. [Debugger For Chrome](https://code.visualstudio.com/blogs/2016/02/23/introducing-chrome-debugger-for-vs-code) - This will add a full debugger which will allow you to easily debug your code while it is running inside of Chrome.
2. [Mocha](https://marketplace.visualstudio.com/items?itemName=Compulim.vscode-mocha) - Mocha extension allows for running Mocha tests in Visual Studio Code

## Tests

Tests will be run using [MochaJS](https://mochajs.org/).  The package will be installed automatically the the NodeJS required modules.  To run the tests type `npm run test`.  All tests will ne located in the `./test` folder.