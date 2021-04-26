// ADD ERROR CATCHING FOR FETCH REQUESTS
// ADD IF INPUT IS BLANK NO SEARCH

// search button
var searchBtn = document.getElementById("search-btn");
// current conditions div (hide)
var currentConditions = document.getElementById("current-conditions");
currentConditions.style.display = "none";
// forecast div (hide)
var forecastContainer = document.getElementById("forecast-container");
forecastContainer.style.display = "none";

// onlick
searchBtn.onclick = function () {
    // city input trimmed
    var cityName = document.getElementById("city-name-input").value.trim();

    // resplace spaces with + for param
    var citySearch = cityName.replace(/\s/g, "+");

    if (citySearch === "" || citySearch === null || citySearch == "N/A") {
        console.log("invalid input");
    } else {
        fetchAndSearch(citySearch);
    };
};

var recentSearchesDiv = document.getElementById("recent-searches");

var fetchAndSearch = function (citySearch) {
    // fetch from open weather
    fetch("http://api.openweathermap.org/data/2.5/weather?units=imperial&q=" +
        citySearch +
        "&appid=8f2d4147e4504d45b103a1243e04d724")
        .then(function (response) {
            return response.json();
        })
        // get lat and lon and use in new fetch search / return results
        .then(function (response) {
            // searched city name
            var searchedCity = response.name;
            
            var newRecentItem = document.createElement("p");
            newRecentItem.className = "recent";
            newRecentItem.textContent = searchedCity;
            recentSearchesDiv.append(newRecentItem);

            // lon for new search
            var lon = (response.coord.lon);

            // lat for new search
            var lat = (response.coord.lat);

            // new search with 2nd open weather api
            fetch(
                "https://api.openweathermap.org/data/2.5/onecall?lat=" +
                lat +
                "&lon=" +
                lon +
                "&units=imperial" +
                "&appid=8f2d4147e4504d45b103a1243e04d724")
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    // forecast array
                    var forecast = [];

                    // today
                    var todaysDate = new Date();
                    var newMonth = todaysDate.getMonth();
                    var newDate = todaysDate.getDate();
                    var currentWeekday = todaysDate.getDay();

                    // date combined into string
                    var monthAndDate = newMonth + "/" + newDate;

                    var weekdays = [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wendesday",
                        "Thursday",
                        "Friday",
                        "Saturday"
                    ];

                    // objects to push to array for each day
                    for (i = 0; i < 6; i++) {
                        var nextDay = {
                            id: "thisDay-" + i,
                            iconURL: "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png",
                            tempMax: response.daily[i].temp.max,
                            tempMin: response.daily[i].temp.min,
                            windSpeed: response.daily[i].wind_speed,
                            humidity: response.daily[i].humidity,
                            uvIndex: response.daily[i].uvi
                        };

                        forecast.push(nextDay);
                    };

                    // update current condition elements to show result
                    currentConditions.style.display = "block";
                    forecastContainer.style.display = "block";

                    var todayTitle = document.getElementById("today-title");
                    todayTitle.textContent = searchedCity + "  (Today " + monthAndDate + ")";
                    todayTitle.className = "border-bottom";

                    var todayImg = document.getElementById("today-img");
                    todayImg.src = forecast[0].iconURL;

                    var todayTemp = document.getElementById("today-temp");
                    todayTemp.textContent = response.current.temp + "\u00B0";

                    var todayMinMax = document.getElementById("today-minmax");
                    todayMinMax.textContent = forecast[0].tempMin + "\u00B0" + " / " + forecast[0].tempMax + "\u00B0";

                    var todayWind = document.getElementById("today-wind");
                    todayWind.textContent = forecast[0].windSpeed + " mph";

                    var todayHumidity = document.getElementById("today-humidity");
                    todayHumidity.textContent = forecast[0].humidity;

                    var todayUV = document.getElementById("today-uv");
                    todayUV.textContent = forecast[0].uvIndex;
                    // change background for favorable, moderate, severe uv
                    if (forecast[0].uvIndex < 6 && forecast[0].uvIndex > 2) {
                        todayUV.className = "col-1 bg-warning";
                    } else if (forecast[0].uvIndex < 3) {
                        todayUV.className = "col-1 bg-success";
                    } else if (forecast[0].uvIndex > 5) {
                        todayUV.className = "col-1 bg-danger"
                    };

                    // forecast container
                    var fiveDayContainer = document.getElementById("five-day-container");

                    for (i = 1; i < 6; i++) {
                        // update current weekday
                        if (currentWeekday < 6) {
                            currentWeekday++;
                        } else if (currentWeekday === 6) {
                            currentWeekday = 0;
                        }

                        // tomorrow div
                        var tomorrow = document.createElement("div");
                        tomorrow.className = "text-center rounded m-2 p-2 bg-light fs-6";
                        tomorrow.id = forecast[i].id;

                        // tomorrow title
                        var tomorrowTitle = document.createElement("h4");
                        tomorrowTitle.textContent = weekdays[currentWeekday];
                        tomorrowTitle.className = "border-bottom";

                        // tomorrow icon
                        var tomorrowIcon = document.createElement("img");
                        tomorrowIcon.src = forecast[i].iconURL;
                        tomorrowIcon.className = "rounded"

                        // tomorrow temp
                        var tomorrowTemp = document.createElement("p");
                        tomorrowTemp.textContent = "Min/Max: " + forecast[i].tempMin + "\u00B0" + " / " + forecast[1].tempMax + "\u00B0";

                        // tomorrow wind speed
                        var tomorrowWind = document.createElement("p");
                        tomorrowWind.textContent = "Wind Speed: " + forecast[i].windSpeed;

                        // tomorrow humidity
                        var tomorrowHumidity = document.createElement("p");
                        tomorrowHumidity.textContent = "Humidity: " + forecast[i].humidity;

                        // add each condition to div
                        tomorrow.append(tomorrowIcon, tomorrowTitle, tomorrowTemp, tomorrowWind, tomorrowHumidity);

                        // add div to forecast
                        fiveDayContainer.append(tomorrow);
                    }
                })
        });
};
