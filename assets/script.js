var countriesUrl = "https://restcountries.com/v3.1/name/";
var form = document.querySelector('form');
var welcomeMessage = document.querySelector('#earth');
var searchInput = document.querySelector('#search-input');
var displayInfo = document.getElementById('display-info');
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiKey = "a8a526129b6eee34cf52f1de1b4a6927";

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    welcomeMessage.style.display = "none";
    var searchTerm = searchInput.value;

    try {
        var response = await fetch(countriesUrl + searchTerm);
        var data = await response.json();

        console.log(data);

        if (data.status === 404) {
            displayInfo.innerHTML = "Country not found.";
        } else {
            var countryData = data[0];
            console.log(countryData);
            var capital = countryData.capital[0];
            var languages = Object.values(countryData.languages).join(", ");
            var currencySymbol, currencyName;
            for (var currencyCode in countryData.currencies) {
                currencySymbol = countryData.currencies[currencyCode].symbol;
                currencyName = countryData.currencies[currencyCode].name;
                 break;
    }
            var population = countryData.population;
            var flag = countryData.flags.png;
            var region = data[0].region
            var latlng = data[0].latlng
            // var maps = data[1].maps


            var fetchWeather = function () {
                fetch(weatherUrl + searchInput.value + "&appid=" + apiKey + "&units=imperial")
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (weatherData) {
                        console.log(weatherData);
                    })
            }


            displayInfo.innerHTML = `
                    <p>Capital: ${capital}</p>
                    <p>Language: ${languages}</p>
                    <p>Currency: ${currencySymbol} ${currencyName}</p>
                    <p>Population: ${population}</p>
                    <p>Region: ${region}</p>
                    <p>Lat-Lng: ${latlng}</p>
                    <img src="${flag}" alt="Flag" width="100">
                    `;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

