'use strict';

/*******************************************************************************
 * START Configuration
 * Change the following variables if you need to.
 ******************************************************************************/

// The pattern to use when writing the current track information
// Valid symbols : %title%, %artist%, %album%
// The backtick ` means carriage returns are preserved so you can do multiline
const outputPattern = `%artist%
%title%`;

// The dimensions to resize the album art to
const albumArtSizeWidth = 75;
const albumArtSizeHeight = 75;

// The file path to write current track information
const trackFilePath = 'Current_Track.txt';

// The file path to write current album art as a png file
const albumArtFilePath = 'Current_Album_Art.png';

// The path to the temporary file for the album art before resizing and converting it
// This isn't really useful to any outside application but it should be writeable
const albumArtTmpFilePath = 'Current_Album_Art.tmp';

/*******************************************************************************
 * END Configuration
 * The rest of the script shouldn't be changed unless you know what you're doing!
 ******************************************************************************/

// Core imports
const fs = require('fs');

// Library imports - make sure to run 'npm install' if you are having errors here
const WebSocket = require('ws');
const Jimp = require('jimp');
const request = require('request');

// WebSocket client instance to connect to default Google Play Music Desktop Player port
const ws = new WebSocket('ws://localhost:5672');

ws.on('error', error => {
  if (error.code === 'ECONNREFUSED') {
    console.error('Error: Connection refused. Please make sure Google Play Music Desktop Player is running ' +
      'and the Playback API is enabled (Menu > Desktop Settings > Enable Playback API). Also make sure your firewall is configured properly.');
  }
  console.error(error);
});

ws.on('message', (rawData) => {
  let data = JSON.parse(rawData);

  // Listen to 'track' channel from GDMDP to get track artist and name
  if (data.hasOwnProperty('channel') && data.channel === 'track') {
    console.log('Changing track info!', data.payload);

    if (data.payload.title === null) {
      // Null title: remove track file
      if (fs.existsSync(trackFilePath)) {
        fs.unlink(trackFilePath, error => {
          if (error) console.error(`Error: Could not delete ${trackFilePath}.`, error);
        });
      }
    } else {
      // Non-null title: output to file
      const outputText = outputPattern.replace(/%artist%/gi, data.payload.artist)
        .replace(/%title%/gi, data.payload.title)
        .replace(/%album%/gi, data.payload.album);

      fs.writeFile(trackFilePath, outputText,
        error => {
          if (error) console.error(`Error: Could not write ${trackFilePath}.`, error);
        });
    }

    if (data.payload.albumArt === null) {
      // Null album art: remove album art files
      if (fs.existsSync(albumArtTmpFilePath)) {
        fs.unlink(albumArtTmpFilePath, error => {
          if (error) console.error(`Error: Could not delete ${albumArtTmpFilePath}.`, error);
        });
      }
      if (fs.existsSync(albumArtFilePath)) {
        fs.unlink(albumArtFilePath, error => {
          if (error) console.error(`Error: Could not delete ${albumArtFilePath}.`, error);
        });
      }
    } else {
      // Non-null album art: download and convert to png
      request(data.payload.albumArt)
        .pipe(fs.createWriteStream(albumArtTmpFilePath))
        .on('error', error => {
          if (error) console.error(`Error: Could not write ${albumArtTmpFilePath} when downloading.`, error);
        })
        .on('finish', () => {
          console.log('Album art downloaded to tmp!');
          Jimp.read(albumArtTmpFilePath, (error, lenna) => {
            if (error) console.error(`Error: Could not read ${albumArtTmpFilePath} when resizing.`, error);
            lenna.resize(albumArtSizeWidth, albumArtSizeHeight).write(albumArtFilePath);
            console.log('Album art resized to png!');
          });
        });
    }
  }
});
