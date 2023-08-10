var countriesUrl = "https://restcountries.com/v3.1/name/";
var form = document.querySelector('form');
var welcomeMessage = document.querySelector('#earth');
var searchInput = document.querySelector('#search-input');
var displayInfo = document.getElementById('display-info');
var weatherInfo = document.querySelector('#weather-info');
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiKey = "a8a526129b6eee34cf52f1de1b4a6927";
displayInfo.style.display = "none";

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    welcomeMessage.style.display = "none";
    displayInfo.style.display = "block";
    var searchTerm = searchInput.value;

    try {
        var response = await fetch(countriesUrl + searchTerm);
        var data = await response.json();

        console.log(data);

        if (response.status === 404) {
            displayInfo.innerHTML = "Country not found.";
        } else {
            if (data.length === 1) {
                var countryData = data[0];
                displayCountryInfo(countryData);
            } else {
                displayCountryOptions(data);
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

function displayCountryOptions(countries) {
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
    });
}

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

        var fetchWeather = function () {
            fetch(weatherUrl + capital + "&appid=" + apiKey + "&units=imperial")
                .then(function (response) {
                    return response.json();
                })
                .then(function (weatherData) {
                    console.log(weatherData);
                    var temp = weatherData.main.temp;

                    weatherInfo.innerHTML = `
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
            <p class="latlng-info">Lat-Lng: <a href="https://www.openstreetmap.org/#map=4/${latlng[0]}/${latlng[1]}" target="_blank">${latlng[0]}, ${latlng[1]}</a></p>
            <img class="flag-info" src="${flag}" alt="Flag" width="100">
        `;
    } catch (error) {
        console.error("Error displaying country info:", error);
    }
}
