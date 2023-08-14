var form = document.querySelector('form');
var welcomeMessage = document.querySelector('.welcome-message');
var searchInput = document.querySelector('#search-input');
var displayInfo = document.getElementById('display-info');
var weatherInfo = document.getElementById('weather-info');

var iconUrl = "https://openweathermap.org/img/w/";
var countriesUrl = "https://restcountries.com/v3.1/name/";
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiKey = "a8a526129b6eee34cf52f1de1b4a6927";

displayInfo.style.display = "none";
weatherInfo.style.display = "none";

// Load existing selected options and countries from local storage
var selectedOptions = JSON.parse(localStorage.getItem('selectedOptions')) || [];
var selectedCountries = JSON.parse(localStorage.getItem('selectedCountries')) || [];
// Retrieve the combined array from localStorage
var combinedArray = JSON.parse(localStorage.getItem('combinedArray')) || [];

// Retrieve and filter the selected options from the combined array
var selectedOptionsFromCombined = combinedArray.filter(item => !item.capital);

// Display the list of selected countries and options
displaySelectedItems(selectedOptionsFromCombined);
// Combine the arrays
var combinedArray = selectedOptions.concat(selectedCountries);


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
            if (data.length === 1) {
                var countryData = data[0];
                displayCountryInfo(countryData);

                // Add the country info to the array of selected countries
                selectedCountries.push({
                  capital: countryData.name.common,
                    name: countryData.capital[0],
                    region: countryData.region
                });

                // Update local storage with the updated array
                localStorage.setItem('selectedCountries', JSON.stringify(selectedCountries));

                // Combine selectedOptions and selectedCountries arrays
                combinedArray = [...selectedOptions, ...selectedCountries];
                // Update local storage with the combined array
                localStorage.setItem('combinedArray', JSON.stringify(combinedArray));
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

        // Add the selected option to the array of selected options
        selectedOptions.push(selectedCountry.name.common);
        
        localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
   // Combine selectedOptions and selectedCountries arrays
   var combinedArray = [...selectedOptions, ...selectedCountries];
   // Update local storage with the combined array
   localStorage.setItem('combinedArray', JSON.stringify(combinedArray));
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
                .then(function (data) {
                    console.log(data);
                  // Display the list of selected countries
                  displaySelectedItems();
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
            <p class="latlng-info">Lat-Lng: <a href="https://www.openstreetmap.org/#map=4/${latlng[0]}/${latlng[1]}" target="_blank">${latlng[0]}, ${latlng[1]}</a></p>
            <img class="flag-info" src="${flag}" alt="Flag" width="100">
        `;
        // Display the list of selected countries
        displaySelectedItems();
    } catch (error) {
        console.error("Error displaying country info:", error);
    }
}


// Display the list of selected countries and options
function displaySelectedItems() {
    var selectedItemsList = document.getElementById('selected-items-list');
    selectedItemsList.innerHTML = "";
  
    var itemsToDisplay = [];
    var maxLength = Math.max(selectedCountries.length, selectedOptionsFromCombined.length);
  
    for (var i = 0; i < maxLength; i++) {
      var countryInfo = selectedCountries[i];
      var option = selectedOptionsFromCombined[i];
  
      if (countryInfo) {
        itemsToDisplay.push(countryInfo.capital + ", " + countryInfo.name + " (" + countryInfo.region + ")");
      }
      if (option) {
        itemsToDisplay.push(option);
      }
    }
  
    // Limit to a maximum of 10 items
    var itemsToDisplayLimited = itemsToDisplay.slice(0, 10);
    itemsToDisplayLimited.reverse();
  
    itemsToDisplayLimited.forEach(function (itemText) {
      var item = document.createElement('li');
      var itemButton = document.createElement('button');
      itemButton.textContent = itemText;
      itemButton.addEventListener('click', function () {
        // Handle button click event for items
      });
      item.appendChild(itemButton);
      selectedItemsList.appendChild(item);
    });
  }

window.addEventListener('load', displaySelectedItems);