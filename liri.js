
//npms
require("dotenv").config();
var Spotify = require('node-spotify-api');
var fs = require('fs');
var request = require('request')

//files needed
var keys = require("./keys.js");

//load the keys
var spotify = new Spotify(keys.spotify);


//prompt storage
var command = process.argv[2];
var search = process.argv[3];
for(var i = 4; i < process.argv.length; i++){
  search += " " + process.argv[i];
}

var checkWeather = function(search){
  if(!search){
    search = "Paris, TX"
  }

  request("https://api.openweathermap.org/data/2.5/weather?q=" + search
  +"&units=imperial&appid=3b0799e355770f102298922af9dcdd52", function(err, data, body) {

    if (!err && data.statusCode === 200) {

      console.log("===============================")
      console.log("Location: " + JSON.parse(body).name);
      console.log("Temperature : " + JSON.parse(body).main.temp + " deg F");
      console.log("Humidity: " + JSON.parse(body).main.humidity + "%");
      console.log("High Temp: " + JSON.parse(body).main.temp_max + " deg F");
      console.log("Low Temp: " + JSON.parse(body).main.temp_min + " deg F");
      console.log("Weather: " + JSON.parse(body).weather[0].main);
      console.log("Wind: " + JSON.parse(body).wind.speed + " mph");
      console.log("===============================")
    }
  });

}

//create function to search spotify
var songSearch = function(search){

  if(!search){
    search = "The Sign Ace of Base"
  }

  spotify.search({type: 'track', query: search},function(err,data){
    //error function
    if (err) {
      return console.log(err);
    }
    console.log("===============================")
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("Song Title: " + data.tracks.items[0].name);
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("Preview Link: " + data.tracks.items[0].preview_url);
    console.log("===============================")
  });
}

//search for a movie on OMDB
var movieSearch = function(search){

  if(!search){
    search = "Mr. Nobody"
  }

  request("http://www.omdbapi.com/?t="+ search + "&y=&plot=short&apikey=trilogy", function(err, data, body) {

    if (!err && data.statusCode === 200) {

      console.log("===============================")
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("Rated: " + JSON.parse(body).Rated);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("===============================")
    }
  });
}

//read random.txt file
var readFile = function(){

  fs.readFile("random.txt","utf8",function(err,data){
    if(err){
      return console.log(err);
    }

    var dataArr = data.split(",");

    switch(dataArr[0]){
      case "my-tweets":
        break;

      case "spotify-this-song":
        songSearch(dataArr[1]);
        break;

      case "movie-this":
        break;
    }

  })
}



//switch to run program
switch(command){
  case "check-weather":
    checkWeather(search);
    break;

  case "spotify-this-song":
    songSearch(search);
    break;

  case "movie-this":
    movieSearch(search);
    break;

  case "do-what-it-says":
    readFile();
    break;

  default:
    console.log("===============================")
    console.log("I'm not that smart yet, so this is not a valid option");
    console.log("Please choose from the following list:")
    console.log("1. check-weather");
    console.log("2. spotify-this-song");
    console.log("3. movie-this");
    console.log("4. do-what-it-says");
    console.log("===============================")
    break;
}