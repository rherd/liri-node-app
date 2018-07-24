// add to the top of liri.js to read and set any environment variables with the dotenv package

require("dotenv").config();

var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var fs = require("fs");

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
      var tweets = response.statuses;
      //console.log(response.statuses);
      //console.log(tweets);

      console.log("Here are your last 20 tweets!");
      for (var i = 0; i < tweets.length; i++) {
        console.log(
          i +
            1 +
            ") " +
            tweets[i].text +
            "\n created at: " +
            tweets[i].created_at
        );
      }
    }
  });
};

var getSong = function() {
  // grab the user request and fill in the spaces with placeholders

  var song = userReq.split(" ");
  var songString = song[0];

  for (var i = 1; i < song.length; i++) {
    songString = songString + "%20" + song[i];
  }

  // now we have the same song with the spaces filled in
  //console.log(songString);

  // call the spotify api next to get the song the user input

  spotify
    .search({ type: "track", query: songString, limit: 1 })
    .then(function(response) {
      //console.log(response);
      //console.log(response.tracks.items);

      var artist = response.tracks.items[0].artists[0].name;
      var name = response.tracks.items[0].name;
      //music.preview_url, music.album.name
      var linkPre = response.tracks.items[0].preview_url;
      var album = response.tracks.items[0].album.name;

      console.log(
        "Artist: " +
          artist +
          "\n" +
          "Name: " +
          name +
          "\n" +
          "Link: " +
          linkPre +
          "\n" +
          "Album: " +
          album +
          "\n"
      );
    })
    .catch(function(err) {
      console.log(err);
    });
};

var movieThis = function() {
  var movies = userReq.split(" ");
  var movieString = movies[0];

  for (var i = 1; i < movies.length; i++) {
    movieString = movieString + "%20" + movies[i];
  }

  omdbCall(movieString);
};

var omdbCall = function(movieString) {
  request(
    // "https://www.omdbapi.com/?t=" +
    //   movieString +
    //   "&y=&plot=short&apikey=trilogy"

    "https://www.omdbapi.com/?t=" +
      movieString +
      "&y=&plot=short&apikey=trilogy",
    function(error, response, body) {
      if (error) {
        console.log(error);
      } else if (!error && response.statusCode === 200) {
        omdbInfo = JSON.parse(body);

        title = omdbInfo.Title;
        year = omdbInfo.Year;
        imdbRating = omdbInfo.imdbRating;
        tomato = omdbInfo.Ratings[1].Value;
        country = omdbInfo.Country;
        lang = omdbInfo.Language;
        plot = omdbInfo.Plot;
        actors = omdbInfo.Actors;

        console.log(
          "Title: " +
            title +
            "\n" +
            "Year: " +
            year +
            "\n" +
            "Imdb Rating: " +
            imdbRating +
            "\n" +
            "Rotten Tomatoes Score: " +
            tomato +
            "\n" +
            "Country: " +
            country +
            "\n" +
            "Language: " +
            lang +
            "\n" +
            "Plot: " +
            plot +
            "\n" +
            "Actors: " +
            actors +
            "\n"
        );
      }
    }
  );
};

if (command === "my-tweets") {
  myTweets();
} else if (command === "spotify-this-song" && userReq) {
  getSong();
} else if (command === "spotify-this-song" && userReq === undefined) {

  spotify
    .request("https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE")
    .then(function(response) {
      
      var artist = response.artists[0].name;
      var name = response.name;
      var linkPre = response.preview_url;
      var album = response.album.name;


      console.log(
        "Artist: " +
          artist +
          "\n" +
          "Name: " +
          name +
          "\n" +
          "Link: " +
          linkPre +
          "\n" +
          "Album: " +
          album +
          "\n"
      );
    })
    .catch(function(err) {
      console.error("Error occurred: " + err);
    });
} else if (command === "movie-this" && userReq) {
  movieThis();
} else if (command === "movie-this" && userReq === undefined) {
  omdbCall("mr%20nobody");
} else if (command === "do-what-it-says" && userReq === undefined) {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var argArr = data.split(",");
      command = argArr[0];
      userReq = argArr[1];

      if (command === "my-tweets") {
        myTweets();
      } else if (command === "spotify-this-song") {
        getSong();
      } else if (command === "movie-this") {
        movieThis();
      }
    }
  });
}
