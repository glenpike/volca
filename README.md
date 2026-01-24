# Volca FM2 Sequence Utility

A project to enable me to download MIDI data for sequences from a Volca FM2 and display them, edit them and send them back.

It was based on Create React App originally.  It uses React Contexts to share state between components and a Zustand store for storing the 'sequences' loaded from the Volca.
There's a lot of code for parsing the MIDI data from the Volca and converting it to a format that can be displayed and edited.

## Done

We can connect to the Volca FM2 and load the current or numbered sequence from it.
The sequence is parsed and shown in the UI as a series of steps, each with up to 
6 enabled notes.  The steps/notes can be edited using standard HTML form inputs
and the changes can be saved back to a chosen numbered sequence on the Volca.

The Volca FM2 needs to be set to use Midi channel 1 to send and receive Sysex messages I think.

If you save to the current sequence to the Volca, you need to swap to another one and back
for the changes to take effect.

It has a 'test' mode that allows you to use the editor without any midi devices connected.
This uses a fake midi device that just responds to messages with the same string of bytes (which is a stored sequence), so you can load it up and test the editing.

## Todo

I would like to make a more visual editor that allows 'drawing' of notes on a grid a bit like a standard 'piano roll' editor.  I've been building this project as a learning exercise to get to grips with React and TypeScript, so I have been focussing on MVP - getting the thing working in a sensible tested state.  I make no promises that it won't mess up your Volca sequences, so back them up or whatever.

I would also like to add the ability to import and export sequences to and from a MIDI file or similar - this may mean changing the way the data is stored as POJO in the store, etc.

There's probably lots of TypeScript tidy up and probably some things around the stores / contexts that can be separated out.

This project was originally bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and ejected, so it retains some of the old CRA structure.
It has been converted to use TypeScript for the src code, but not tests.

The tests are currently written in JS, but changing them to TS would mean ripping out the configuration and updating all of the node modules, which is a job for another day because there are dependencies on the old CRA packages that are incompatible.  It may be easier to port the code to a new, non-CRA project.


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

Launches the test runner (jest).
