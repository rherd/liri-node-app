// add to the top of liri.js to read and set any environment variables with the dotenv package

require("dotenv").config();

// add code required to import the keys.js file and store it in a variable
var keys = require("./keys.js");

// access information from keys like so
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// make it so that liri can take in the following commands:
// 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-is-says'

