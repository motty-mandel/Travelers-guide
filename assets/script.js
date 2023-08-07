var restCountriesUrl = "https://restcountries.com/v3.1/name/";
var searchInput = document.querySelector('#search-input');
var countryName = searchInput.value;


fetch(restCountriesUrl + countryName)
.then(function(response) {
    return response.json()
})
.then(function(data) {
console.log(data)
var capital = data[0].capital[0];
var language = data[0].languages.eng;
var currency = data[0].currencies.USD.symbol + data[0].currencies.USD.name;
var population = data[0].population;
var flag = data[0].flags.png;
console.log(capital, language, currency, population, flag);
})