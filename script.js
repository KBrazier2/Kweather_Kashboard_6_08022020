$(document).ready(function(){
    var longitude;
    var latitude;
    $(document).ready(function() {
        var interval = setInterval(function(){
            var momentNow = moment();
            $("#date-part").html(momentNow.format("dddd").substring(0,8).toUpperCase() + "  " + momentNow.format("MMMM DD YYYY"));
            $("#time-part").html(momentNow.format("hh:mm:ssa"));
        }, 100);
    });
    function getLocation() {
        navigator.geolocation.getCurrentPosition(showPosition);
        showPosition();
    }
    function showPosition(position) {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        console.log(longitude);
        console.log(latitude);
        renderWeather()
    }
    function renderWeather(){
        var WeatherAPIKey = "37d198b6a9dd6e25b1cb3dcdfedb4eb1"
        var GoogleAPIKey = "AIzaSyCnlH4DL3Nulo9wAc_EUZKTzHZKA7B2KPI"
        var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + GoogleAPIKey;
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude +  "&units=imperial&appid=" + WeatherAPIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            $("#currentWeather").empty();
            var tempEl = $("<p id='temp' class='card-text'>");
            var humidEl = $("<p id='humid' class='card-text'>");
            var windEl = $("<p id='wind' class='card-text'>");
            var uvidEl = $("<p id='uvid' class='card-text'>");
            var weatherData = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + ".png";
            var tempData = response.current.temp;
            var humidData = response.current.humidity;
            var windData = response.current.wind_speed;
            var uvidData = response.current.uvi;
            var weatherIcon = $("<img>").attr("src", weatherData);
            weatherIcon.empty();
            $("#currentWeather").prepend(weatherIcon);
            tempEl.text("Temperature: " + tempData + String.fromCharCode(176) + "F");
            humidEl.text("Humidity: " + humidData + "%");
            windEl.text("Wind Speed: " + windData + "Mph");
            uvidEl.text("UV Index: " + uvidData);
            $("#currentWeather").append(tempEl);
            $("#currentWeather").append(humidEl);
            $("#currentWeather").append(windEl);
            $("#currentWeather").append(uvidEl);
            if (uvidData < 8){
                uvidEl.removeClass("high");
                uvidEl.addClass("low");
            }
            else {
                uvidEl.removeClass("low");
                uvidEl.addClass("high");
            }
            $("#fivedayBody").html("");
            for (i =1; i < 6; i++){
                var fivedayDate = moment().add(i, 'days').format('L');  
                var fivedayCol = $("<div class='col-sm'>");
                var fivedayCard = $("<div class='card fiveday'>");
                var fivedayHeader = $("<div class='card-header'>");
                var fivedayDateP = $("<p>").text(fivedayDate);
                $("#fivedayBody").append(fivedayCol);
                fivedayCol.append(fivedayCard);
                fivedayCard.append(fivedayHeader);
                fivedayHeader.append(fivedayDateP);
                var fivedayWeatherData = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png";
                var fivedayTempData = response.daily[i].temp.day;
                var fivedayHumidData = response.daily[i].humidity;
                var fivedayData = $("<div class='card-body'>");
                var fivedayWeatherIcon = $("<img>").attr("src", fivedayWeatherData);
                var fivedayTempEl = $("<p>").text("Temperature: " + fivedayTempData + String.fromCharCode(176) + "F");
                var fivedayHumidEl = $("<p>").text("Humidity: " + fivedayHumidData + "%");
                fivedayCard.append(fivedayData);
                fivedayData.append(fivedayWeatherIcon, fivedayTempEl, fivedayHumidEl);
            }
        });
        $.ajax({
            url: googleURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            var fivedayDate = moment().format('L');
            var cityDiv = $("#cityName");
            var cityData = response.results[6].formatted_address;
            cityDiv.html("");
            var cityDisplay = $("<h3 class='display-4'>").text(cityData);
            var dateDisplay = $("<h3 class='display-4'>").text(fivedayDate);
            cityDiv.append(cityDisplay, dateDisplay);
        });
    }
    var clickCity;
    function citybutton(){
        var OpenCageAPIKey = "018eae80efa940958a187269d38fdc75"
        var opencageURL = "https://api.opencagedata.com/geocode/v1/json?q=" + clickCity + "&key=" + OpenCageAPIKey;
        $.ajax({
            url: opencageURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            latitude = response.results[0].geometry.lat
            longitude = response.results[0].geometry.lng
            renderWeather();
        })
    }
    var cityHistory = ["Tokyo", "Seoul", "Ho Chi Minh", "Honolulu", "San Francisco", "New York", "London", "Barcelona", "Paris", "Rome", "Amsterdam"];
    function StorageCheck() {
        var storedCity = JSON.parse(localStorage.getItem("searchHistory"));
        if (storedCity !== null) {
          cityHistory = storedCity;
        }
        renderButtons();
    }
    function renderButtons() {
        $("#CityButton").html("");
        for (var i = 0; i < cityHistory.length; i++) {
            var city = cityHistory[i];
            var newButton = $("<button>");
            newButton.addClass("btn btn-primary searchResult display-4");
            newButton.attr("data-name", city);
            newButton.attr("id", "cityButton");
            newButton.text(city);
            $("#CityButton").prepend(newButton);
        }        
    }
    $("#CityButton").on("click","button", function(event) {
        event.preventDefault();
        clickCity = $(this).attr("data-name");
        console.log(clickCity);
        citybutton();
    })
    $("#searchButton").on("click", function(event) {
        event.preventDefault();
        var searchValue = ($("#searchBar").val().toUpperCase());
        if (searchValue === "") {
            return;
        }
        cityHistory.push(searchValue);
        localStorage.setItem("searchHistory", JSON.stringify(cityHistory));
        $("#searchBar").val("");
        renderButtons();
    })
    $("#clearButton").on("click", function(event) {
        event.preventDefault();
        $("#searchBar").val("");
        localStorage.clear();
        cityHistory = ["Tokyo", "Seoul", "Ho Chi Minh", "Honolulu", "San Francisco", "New York", "London", "Barcelona", "Paris", "Rome", "Amsterdam"];
        $("#CityButton").html("");
        renderButtons();
    })
    StorageCheck();
    getLocation();
});



