# weather-dashboard
A weather dashboard using the OpenWeather API

The live application deployment link is:
https://jdlawton.github.io/weather-dashboard/

The GitHub repo link is:
https://github.com/jdlawton/weather-dashboard


Following the challenge criteria, I accomplished the following:
* Created a web page that allows the user to search for weather data using the OpenWeather api.
* The user can enter a city name to search for, the application then calls OpenWeather through a series of api calls to return the folowing information:
    - current temperature
    - current humidity
    - current wind speed
    - current uv index
    - weather icons corresponding to the current weather
    - 5-day forecast consisting of date, temperature, humidity, and the corresponding weather icons.
* The retrieved UV index is also assigned a status according to EPA guidelines and color coded based on severity.
* Previously searched cities are stored in a search history along the left-hand side of the page. These entries are made persistant using localStorage.
* Clicking on any of the cities in the search history will display the current data for the city as well as the appropriate 5-day forecast.
* Clicking the Clear button in the Search History section will clear the history both on the page and in localStorage.


Screenshot:
![Project Screenshot1](/weatherscreenshot.png?raw=true)