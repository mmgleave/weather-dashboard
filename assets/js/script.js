var searchBtn = document.getElementById("search-btn");
var currentConditions = document.getElementById("current-conditions");
currentConditions.style.display = "none"; 

searchBtn.onclick = function(){
        // city input trimmed
        var cityName = document.getElementById("city-name-input").value.trim();

        // resplace spaces with + for param
        var citySearch = cityName.replace(/\s/g, "+");

        // check this is working
        console.log(citySearch);

        // fetch from open weather
        fetch("http://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + 
        citySearch + 
        "&appid=8f2d4147e4504d45b103a1243e04d724")
        .then(function(response){
            return response.json();
        })
        // get lat and lon and use in new fetch search
        .then(function(response){
            // searched city name
            var searchedCity = response.name;

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
                .then(function(response){
                    return response.json();
                })
                .then(function(response){
                    // forecast array
                    var forecast = [];

                    // today
                    var month = new Date();
                    var newMonth = month.getMonth();
                    var date = new Date();
                    var newDate = date.getDate();

                    // date combined into string
                    var monthAndDate = newMonth + "/" + newDate;

                    // objects to push to array for each day
                    for(i=0; i<6; i++){
                        var nextDay = {
                            id: "thisDay-" + i,
                            iconURL: "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon +"@2x.png",
                            currentTemp: response.daily[i].temp,
                            tempMax: response.daily[i].temp.max,
                            tempMin: response.daily[i].temp.min,
                            windSpeed: response.daily[i].wind_speed,
                            humidity: response.daily[i].humidity,
                            uvIndex: response.daily[i].uvi
                        };

                        forecast.push(nextDay);
                        console.log(forecast)
                    };
                    
                    // update current condition elements to show result
                    currentConditions.style.display = "block";

                    var todayTitle = document.getElementById("today-title");
                    todayTitle.textContent = searchedCity + "  (" + monthAndDate + ")";

                    var todayImg = document.getElementById("today-img");
                    todayImg.src = forecast[0].iconURL;

                    var todayTemp = document.getElementById("today-temp");
                    todayTemp.textContent = "Temperature (Min/Max): "

                    // <li id="today-temp">Temperature: </li>
                    //     <li id="today-wind">Wind Speed: </li>
                    //     <li id="today-humidity">Humidity: </li>
                    //     <li id="today-uv">UV Index: </li>
                })
        })
    }