
//Current weather stored in an object. I find it easier to keep track of this way instead of making it 6 separate variables.
var currentWeather = {
    name: "",
    date: "",
    temp: "",
    humidity: "",
    wind: "",
    uv: "",
    icon: ""
}

//array for storing the previously searched cities
var searchHistory = [];

//querySelectors for various page elements I will need to reference in the sccript.
var cityNameEl = document.querySelector("#name");
var curDateEl = document.querySelector("#date");
var curIconEl = document.querySelector("#icon");
var curTempEl = document.querySelector("#temp");
var curHumidityEl = document.querySelector("#humidity");
var curWindEl = document.querySelector("#wind");
var curUvEl = document.querySelector("#uv");
var searchInputEl = document.querySelector("#search-city");
var formEl = document.querySelector("#search-form");
var historyEl = document.querySelector("#history");
var clearBtnEl = document.querySelector("#clear-history");


//getWeather is the function that makes the api calls to OpenWeather. The city parameter is passed to it from searchFormHandler.
//The initial api call returns most of the needed data. I use moment.js to get and format the current date. I also get the latitude
//and longitude from the data returned by the primary api and use that to form the second api call which returns the UV index.
//Once the second call is done, it calls displayWeather to put all of the info up on the page.
var getWeather = function (city){

    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=################";
    var lat = "";
    var lon = "";
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                currentWeather.name = data.name;
                currentWeather.date = moment().format("dddd, MMMM Do YYYY");
                currentWeather.temp = data.main.temp + " &#176F";
                currentWeather.humidity = data.main.humidity+"%";
                currentWeather.wind = data.wind.speed + " MPH";
                currentWeather.icon = data.weather[0].icon;
                lat = data.coord.lat;
                lon = data.coord.lon;
                console.log(currentWeather);

                //console.log("lat: " + lat + " lon: " + lon);

                fetch("http://api.openweathermap.org/data/2.5/uvi?appid=################&lat="+lat+"&lon="+lon)
                .then(function(uvResponse) {
                    uvResponse.json().then(function(uvData) {
                        //console.log(uvData);
                        currentWeather.uv = uvData.value;
                        //console.log("UV: " + currentWeather.uv);
                        displayWeather();
                    });
                });

            });
        }
    });
}

//displays the information that has been collected from the api calls onto the page.
var displayWeather = function() {
    //console.log("inside displayWeather");
    cityNameEl.innerHTML = currentWeather.name;
    curDateEl.innerHTML = currentWeather.date;
    curTempEl.innerHTML = currentWeather.temp;
    curHumidityEl.innerHTML = currentWeather.humidity;
    curWindEl.innerHTML = currentWeather.wind;
    curUvEl.innerHTML = currentWeather.uv;
    curIconEl.innerHTML = "<img src='http://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png'></img>";

}

//displays the searchHistory array into the history div element on the page
var displayHistory = function() {
    console.log("inside displayHistory");
    historyEl.innerHTML = "";
    for (var i = 0; i<searchHistory.length; i++) {
        var historyDiv = document.createElement("div");
        historyDiv.innerHTML = "<h4>"+searchHistory[i]+"</h4>";
        historyEl.appendChild(historyDiv);
    }
}

//loads the search history from localStorage into the searchHistory array and then calls displayHistory function.
var loadHistory = function() {
    console.log("inside loadHistory");
    searchHistory = JSON.parse(localStorage.getItem("history"));
    if (!searchHistory) {
        searchHistory = [];
    }
    displayHistory();
}

//function called by the event listener, it gets the value from the input in the form, validates it, and then passes it on to 
//the getWeather function.
var formSubmitHandler = function(event) {
    //console.log("inside formSubmitHandler");
    event.preventDefault();
    var searchCity = searchInputEl.value.trim();
    //console.log ("Search City: " + searchCity);
    if (searchCity) {
        getWeather(searchCity);
        searchHistory.push(searchCity);
        localStorage.removeItem("history");
        localStorage.setItem("history", JSON.stringify(searchHistory));
        displayHistory();
        searchInputEl.value = "";
    }
    else {
        alert("Please enter a valid city name!");
    }
}

var clearHistory = function() {
    localStorage.removeItem("history");
    searchHistory = [];
    displayHistory();
}


//console.log(currentWeather);
loadHistory();

//event listener for when the user clicks the submit button in the form
formEl.addEventListener("submit", formSubmitHandler);
clearBtnEl.addEventListener("click", clearHistory);