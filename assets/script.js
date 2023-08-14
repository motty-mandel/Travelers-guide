//variables for search input
var form = document.querySelector('form');
var welcomeMessage = document.querySelector('.welcome-message');
var searchInput = document.querySelector('#search-input');
var displayInfo = document.getElementById('display-info');
var weatherInfo = document.getElementById('weather-info');

var displaySection = document.getElementById('#display-section');
var capitalInfo = document.querySelector('.capital-info');
var languageInfo = document.querySelector('.language-info');
var currencyInfo = document.querySelector('.currency-info');
var populationInfo = document.querySelector('.population-info');
var regionInfo = document.querySelector('.region-info');
var latlngInfo = document.querySelector('latlng-info');

// Used APIs
var iconUrl = "https://openweathermap.org/img/w/";
var countriesUrl = "https://restcountries.com/v3.1/name/";
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiKey = "a8a526129b6eee34cf52f1de1b4a6927";

displayInfo.style.display = "none";
weatherInfo.style.display = "none";

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    welcomeMessage.style.display = "none";
    displayInfo.style.display = "block";
    weatherInfo.style.display = "block";
    var searchTerm = searchInput.value;

    try {
        var response = await fetch(countriesUrl + searchTerm);
        var data = await response.json();

        console.log(data);

        if (response.status === 404) {
            displayInfo.innerHTML = "Country not found.";
        } else {
            //local storage
            if (data.length === 1) {
                var countryData = data[0];
                displayCountryInfo(countryData);
                localStorage.setItem('lastSearched', searchTerm);
            } else {
                displayCountryOptions(data);
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

var lastSearched = localStorage.getItem('lastSearched');

if (lastSearched) {
    searchInput.value = lastSearched;
    form.dispatchEvent(new Event('submit'));
}
//dropdown menu when there are multiple search results
function displayCountryOptions(countries) {
    weatherInfo.style.display = "none";
    var optionsHtml = countries.map((country, index) => {
        return `<option value="${index}">${country.name.common}</option>`;
    }).join('');

    displayInfo.innerHTML = `
        <p>Multiple countries found. Please select one:</p>
        <select id="country-select">
            ${optionsHtml}
        </select>
        <button id="select-button">Select</button>
    `;

    var selectButton = document.getElementById('select-button');
    var countrySelect = document.getElementById('country-select');

    selectButton.addEventListener('click', () => {
        var selectedIndex = parseInt(countrySelect.value);
        var selectedCountry = countries[selectedIndex];
        displayCountryInfo(selectedCountry);
        weatherInfo.style.display = "block";
    });
}
//displays information about searched country 
function displayCountryInfo(countryData) {
    try {
        var capital = countryData.capital[0];
        var languages = Object.values(countryData.languages).join(', ');
        var currencySymbol, currencyName;
        for (var currencyCode in countryData.currencies) {
            currencySymbol = countryData.currencies[currencyCode].symbol;
            currencyName = countryData.currencies[currencyCode].name;
            break;
        }
        var population = countryData.population;
        var flag = countryData.flags.png;
        var region = countryData.region;
        var latlng = countryData.latlng;
// displays weather for capital city of searched country
        var fetchWeather = function () {
            fetch(weatherUrl + capital + "&appid=" + apiKey + "&units=imperial")
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    var temp = data.main.temp;
                    var forecast = data.weather[0].description;
                    var icon = data.weather[0].icon;
                    

                    weatherInfo.innerHTML = `
                        <img src="${iconUrl + icon + ".png"}" alt="weather-icon">
                        <p>Forecast: ${forecast}</p>
                        <p>Temperature: ${temp}°F</p>
                        <img src="" alt="">
                    `;
                });
        };
        fetchWeather();

        displayInfo.innerHTML = `
            <p class="capital-info">Capital: ${capital}</p>
            <p class="language-info">Language: ${languages}</p>
            <p class="currency-info">Currency: ${currencySymbol} ${currencyName}</p>
            <p class="population-info">Population: ${population}</p>
            <p class="region-info">Region: ${region}</p>
            <p class="latlng-info">Lat-Lng: <a href="https://www.openstreetmap.org/#map=4/${latlng[0]}/${latlng[1]}" 
            target="_blank"> <span class="coordinates">${latlng[0]}, ${latlng[1]}</span></a></p>
            <img class="flag-info" src="${flag}" alt="Flag" width="100">
        `;
    } catch (error) {
        console.error("Error displaying country info:", error);
    }
}
