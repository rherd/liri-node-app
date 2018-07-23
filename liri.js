// add to the top of liri.js to read and set any environment variables with the dotenv package

require("dotenv").config();

var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");

// add code required to import the keys.js file and store it in a variable
var keys = require("./keys.js");

// access information from keys like so
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// make it so that liri can take in the following commands:
// 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-is-says'

// console.log(spotify);
// console.log(client);

var input = process.argv;

var command = input[2];
var userReq = input[3];

var myTweets = function() {
  client.get("search/tweets", { q: "rupertennis", count: 20 }, function(
    error,
    response
  ) {
    if (error) {
      console.log(error);
    } else {
      tweets = response.statuses;
      //console.log(response.statuses);
      //console.log(tweets);

      console.log("Here are your last 20 tweets!");
      for (var i = 0; i < tweets.length; i++) {
        console.log(i + 1 + ") " +  tweets[i].text + "\n created at: " + tweets[i].created_at);
      }
    }
  });
};

myTweets();
