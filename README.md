# Volca FM2 Sequence Utility

A project to enable me to download sequences from a Volca FM2 and display them, hopefully editing them and sending them back.

## Done

[x] Selecting a Midi In & Out port and setting a channel
[x] Getting a sequence from the Volca with Sysex commands
[x] Expanding Midi 7bit bytes to 8bit and reverse
[x] Parsing the Sysex into Plain Old JavaScript Objects (POJOs) with 'global' values (Sequence) and a set of Steps
[x] Displaying the Sequence & Steps as JSON

## Todo
[ ] Turning a Sequence and Steps back into Sysex
[ ] Sending it back to the Volca
[ ] Allowing Editing of JSON
[ ] Allowing conversion of a Sequence to and from a Midi file or similar
[ ] Visual editing of sequence data

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Setup

`npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
