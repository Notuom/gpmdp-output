# Deprecation notice

Google Play Music has been shut down and the YouTube Music flavor of Google Play Music Desktop Player does not work with this script. If you are looking for this feature with YouTube Music, please see the following repository:

## https://github.com/Notuom/ytmd-obs-output

# GPMDP-Output

[Open Broadcaster Software (OBS)](https://obsproject.com/) streaming helper for [Google Play Music Desktop Player (GPMDP)](https://www.googleplaymusicdesktopplayer.com/).

Listens to the WebSocket Playback interface of GPMDP and outputs formatted track information and album art files which can be consumed by OBS.

Handy for streaming currently played song from GPMDP and doesn't require configuration unless you want to customize the output.

## Features

* Output track information to a txt file which can then be used in OBS Studio
  * Customizable track information display
* Output album art to a png file which can then be used in OBS Studio
  * Customizable resolution
* Easy to use! (kinda... 😉)

## Setting up Google Play Music Desktop Player

Before using the script, you should make sure your GPMDP is ready to interact with it. Make sure the Playback API is enabled (Menu > Desktop Settings > Enable Playback API). Also make sure your firewall is configured properly by allowing access to Node.js and GPMDP if they ask for it.

## Setting up and running the script

If you have prior Node.js experience, this should be no problem. If you don't, I tried to make things as easy as possible :

1. Install [Node.js](https://nodejs.org/) v12 (or whichever LTS is available when you are reading this). Ensure the tools are installed in your PATH (for Windows, this should be an option in the installer).
2. Download this repo. ([Click here to download the latest version as a zip](https://github.com/Notuom/gpmdp-output/archive/master.zip))
3. Extract somewhere you don't mind keeping it (for Windows, somewhere that doesn't require administrator access).
4. Execute the `install.bat` file (Windows) or `install.sh` file (Linux / macOS). You should be able to do that by double-clicking it.
5. Execute the `gpmdp_output.bat` file (Windows) or `gpmdp_output.sh` file (Linux / macOS). You should be able to do that by double-clicking it.
6. To close the script, use CTRL+C or close the command prompt window.

Steps 1 - 4 only have to be done once. After that, simply execute the relevant `gpmdp_output` file and let it run while GPMDP and your streaming application are open.

## Adding the output to OBS Studio

To add the current track info, add a new Text (GDI+) source. Check the "Read from file" box and choose the "Current_Track.txt" file generated by this program.

To add the album art, add a new Image source and select the Current_Album_Art.png file generated by this program.

## Configuration

Open the gpmdp_output.js file in a text editor and change the variables described at the beginning of the file. This configuration allows you to change the track format, album art size and so forth.

By default, all files will be written in the same folder as the script. This can also be changed by using the configuration.

# Special thanks

Special thanks to GPMDP for the awesome application and easy to use API!
