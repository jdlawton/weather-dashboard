
//current weather stored in an object. I find it easier to keep track of this way instead of making it 6 separate variables.
var currentWeather = {
    name: "",
    date: "",
    temp: "",
    humidity: "",
    wind: "",
    uv: "",
    uvAlert: "",
    icon: ""
}

//array used to store the forecast data, each day in the forecast will be stored as
//an object within the array.
var forecast = [];

//array for storing the previously searched cities
var searchHistory = [];

//the OpenWeather api key used for this project
var apiKey = "37aaca1ccbcb9f155c5f005b5bdbf024";

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
var uvAlertEl = document.querySelector("#uv-alert");
var forecastEl = document.querySelector("#forecast-body");
var resultsContEl = document.querySelector("#results-container");
var forecastContEl = document.querySelector("#forecast-container");
var curStatsEl = document.querySelector("#current-stats");



//getWeather is the function that makes the api calls to OpenWeather. The city parameter is passed to it from searchFormHandler.
//The initial api call returns most of the needed data. I use moment.js to get and format the current date. I also get the latitude
//and longitude from the data returned by the primary api and use that to form the second api call which returns the UV index.
//Once the second call is done, it calls displayWeather to put all of the info up on the page.
var getWeather = function (city){

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=" + apiKey;
    var lat = "";
    var lon = "";
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                currentWeather.name = data.name;
                currentWeather.date = moment().format("dddd, MMMM Do YYYY");
                currentWeather.temp = data.main.temp + " &#176F";
                currentWeather.humidity = data.main.humidity+"%";
                currentWeather.wind = data.wind.speed + " MPH";
                currentWeather.icon = data.weather[0].icon;
                lat = data.coord.lat;
                lon = data.coord.lon;

                var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat="+lat+"&lon="+lon;
                fetch(uvUrl)
                .then(function(uvResponse) {
                    if (uvResponse.ok) {
                        uvResponse.json().then(function(uvData) {
                            //console.log(uvData);
                            currentWeather.uv = uvData.value;
                            displayWeather();
                            getForecast(city);
                        });
                    }
                    else {
                        curUvEl.innerHTML = "Error";
                        currentWeather.uv = "error";
                    }
                    
                });

            });
        } else {
            //alert ("Error: " + response.statusText);
            clearData();
            cityNameEl.innerHTML = "Error: " + response.status + " " + city + " " + response.statusText;


        }
    })
    .catch (function(error) {
        cityNameEl.innerHTML = error.message + " Please try again later.";
    })
}

//getForecast takes the city the user searched for (from getWeather) and makes an api call to get the 5-day forecast
//it then iterates through the array of data returned from OpenWeather and pulls out the relevant data from the NOON
//forecast, ignoring any data returned for the same day as today. It creates an object for each day and then pushes
//that object to the forecast array so the data can be easily retrieved later on.
var getForecast = function (city) {
    //console.log("inside getForecast");
    //console.log("city: " + city);
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
    fetch(forecastUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //console.log(data);

                //get today and format it so it can be easily compared with the dates returned by the api call
                //I want to ignore any data with a date that matches today.
                var today = moment().format("YYYY-MM-DD");
                //console.log(today);
                for (var i=0; i<data.list.length; i++){
    
                    //OpenWeather returns a value called dt_txt which is the date and the time separated by a " ".
                    //I split this string and save it to dateTime where [0] is the date and [1] is the time.
                    var dateTime = data.list[i].dt_txt.split(' ');
    
                    //this is the data we want to add, anything with a date not today and with a time of noon
                    if (dateTime[0] !== today && dateTime[1] === "12:00:00" ) {
                        var futureDate = {
                            date: moment(dateTime[0]).format("MM/DD/YYYY"),
                            time: dateTime[1],
                            icon: data.list[i].weather[0].icon,
                            temp: data.list[i].main.temp,
                            humidity: data.list[i].main.humidity
                        };
                        forecast.push(futureDate);
                    }
                }
                displayForecast();
            })
        }
        else {
            forecastEl.innerHTML = "Error: " + response.status + " " + response.statusText;
        }
    })
    .catch (function(error) {
        forecastEl.innerHTML = error.message;
    })
}

//displayForecast takes the data from the forecast array and creates individual cards for each day. Those cards are then 
//displayed within the 5-day forecast container on the page.
var displayForecast = function () {
    //console.log("inside displayForecast");
    for (var i=0; i<forecast.length; i++) {
        var cardContainerEl = document.createElement("div");
        cardContainerEl.classList.add("col-xl");
        cardContainerEl.classList.add("col-md-4");

        var cardEl = document.createElement("div");
        cardEl.classList.add("card");
        cardEl.classList.add("forecast-card");

        var cardBodyEl = document.createElement("div");
        cardBodyEl.classList.add("card-body");

        var dateEl = document.createElement("h5");
        dateEl.classList.add("card-title");
        dateEl.innerHTML = forecast[i].date;
        cardBodyEl.appendChild(dateEl);

        var iconEl = document.createElement("p");
        iconEl.classList.add("card-text");
        iconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + forecast[i].icon + "@2x.png'></img>";
        cardBodyEl.appendChild(iconEl);

        var tempEl = document.createElement("p");
        tempEl.classList.add("card-text");
        tempEl.innerHTML = "Temp: " + forecast[i].temp;
        cardBodyEl.appendChild(tempEl);

        var humidityEl = document.createElement("p");
        humidityEl.classList.add("card-text");
        humidityEl.innerHTML = "Humidity: " + forecast[i].humidity
        cardBodyEl.appendChild(humidityEl);

        cardEl.appendChild(cardBodyEl);
        cardContainerEl.appendChild(cardEl);
        forecastEl.appendChild(cardContainerEl);

    }
}

//displays the information that has been collected from the api calls onto the page.
var displayWeather = function() {
    curStatsEl.style.display = "block";
    forecastContEl.style.display = "block";
    cityNameEl.innerHTML = currentWeather.name;
    curDateEl.innerHTML = currentWeather.date;
    curTempEl.innerHTML = currentWeather.temp;
    curHumidityEl.innerHTML = currentWeather.humidity;
    curWindEl.innerHTML = currentWeather.wind;
    curUvEl.innerHTML = currentWeather.uv;
    curIconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png'></img>";
    uvCheck();

}

//displays the searchHistory array into the history div element on the page
var displayHistory = function() {
    //console.log("inside displayHistory");
    historyEl.innerHTML = "";
    for (var i = 0; i<searchHistory.length; i++) {
        var historyDiv = document.createElement("div");
        historyDiv.classList.add("history-item");
        historyDiv.innerHTML = "<h4>"+searchHistory[i]+"</h4>";
        historyEl.appendChild(historyDiv);
    }
}

//loads the search history from localStorage into the searchHistory array and then calls displayHistory function.
var loadHistory = function() {
    //console.log("inside loadHistory");
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
        clearForecast();
        displayHistory();
        searchInputEl.value = "";
    }
    else {
        //if getting the city name would return anything falsy, i.e. empty input field, just ignore it and return.
        return;
    }
}

//function is called when the clear history button is pressed.
var clearHistory = function() {
    localStorage.removeItem("history");
    searchHistory = [];
    displayHistory();
}

//uvCheck will compare the uv index from OpenWeather and classify it as low, moderate, high, very high, or extreme
//it will then display that alert next to the UV index data and color code it.
//if currentWeather.uv === "error" then the fetch for the uv data failed and function will return w/o evaluating anything.
var uvCheck = function() {
    if (currentWeather.uv === "error") {
        return;
    }

    if (currentWeather.uv < 3) {
        currentWeather.uvAlert = "low";
        uvAlertEl.textContent = "low";
        uvAlertEl.classList.add("alert-success");
        return;
    }
    else if (currentWeather.uv < 6) {
        currentWeather.uvAlert = "moderate";
        uvAlertEl.textContent = "moderate";
        uvAlertEl.classList.add("alert-warning");
        return;
    }
    else if (currentWeather.uv < 8) {
        currentWeather.uvAlert = "high";
        uvAlertEl.textContent = "high";
        uvAlertEl.classList.add("alert-danger");
        return;
    }
    else if (currentWeather.uv < 11) {
        currentWeather.uvAlert = "very high";
        uvAlertEl.textContent = "very high";
        uvAlertEl.classList.add("alert-danger");
        return;
    }
    else {
        currentWeather.uvAlert = "extreme";
        uvAlertEl.textContent = "extreme";
        uvAlertEl.classList.add("alert-danger");
    }
}

//clears the forecast data from the page and empty's the forecast array
var clearForecast = function () {
    forecast = [];
    forecastEl.innerHTML = "";
}

//this function allows the user to click on a city listed in the search history and search for that city
var historyClickHandler = function (event) {
    //console.log("inside historyClickHandler");
    var histCity = event.target.textContent;
    if (histCity) {
        clearForecast();
        getWeather(histCity);
    }
}

//clears the data in the results column, hiding the forecast card as well as the card-body of the current weather.
//it also clears all date from the card header other than the name which may be used for other things like
//displaying error messages.
var clearData = function () {
    console.log("inside clearData");
    curStatsEl.style.display = "none";
    forecastContEl.style.display = "none";
    curDateEl.innerHTML = "";
    curIconEl.innerHTML = "";
}

//console.log(currentWeather);
loadHistory();

//event listener for when the user clicks the submit button in the form
formEl.addEventListener("submit", formSubmitHandler);
clearBtnEl.addEventListener("click", clearHistory);
historyEl.addEventListener("click", historyClickHandler);