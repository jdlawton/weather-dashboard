var currentWeather = {
    name: "",
    date: "Today",
    temp: "",
    humidity: "",
    wind: "",
    uv: "Another API"
}

var cityNameEl = document.querySelector("#name");
var curDateEl = document.querySelector("#date");
var curIconEl = document.querySelector("#icon");
var curTempEl = document.querySelector("#temp");
var curHumidityEl = document.querySelector("#humidity");
var curWindEl = document.querySelector("#wind");
var curUvEl = document.querySelector("#uv");


var getWeather = function (){
    console.log("inside getWeather");

    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=Chicago&units=imperial&appid=############################";
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                currentWeather.name = data.name;
                currentWeather.date = moment().format("dddd, MMMM Do YYYY");
                currentWeather.temp = data.main.temp + " &#176F";
                currentWeather.humidity = data.main.humidity+"%";
                currentWeather.wind = data.wind.speed + " MPH";
                displayWeather();
            });
        }
    });
}

var displayWeather = function() {
    console.log("inside displayWeather");
    cityNameEl.innerHTML = currentWeather.name;
    curDateEl.innerHTML = currentWeather.date;
    curTempEl.innerHTML = currentWeather.temp;
    curHumidityEl.innerHTML = currentWeather.humidity;
    curWindEl.innerHTML = currentWeather.wind;

}



getWeather();
console.log(currentWeather);