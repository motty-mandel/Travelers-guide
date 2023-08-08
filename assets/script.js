var countriesUrl = "https://restcountries.com/v3.1/name/";
        var form = document.querySelector('form');
        var searchInput = document.querySelector('#search-input');
        var displayInfo = document.getElementById('display-info');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            var searchTerm = searchInput.value;

            try {
                var response = await fetch(countriesUrl + searchTerm);
                var data = await response.json();

                if (data.status === 404) {
                    displayInfo.innerHTML = "Country not found.";
                } else {
                    var countryData = data[0];
                    var capital = countryData.capital[0];
                    var language = countryData.languages.eng;
                    var currency = countryData.currencies.USD.symbol + ' ' + countryData.currencies.USD.name;
                    var population = countryData.population;
                    var flag = countryData.flags.png;
                    var region = data[0].region
                    var latlng = data[0].latlng
                    var maps = data[1].maps

                    displayInfo.innerHTML = `
                        <p>Capital: ${capital}</p>
                        <p>Language: ${language}</p>
                        <p>Currency: ${currency}</p>
                        <p>Population: ${population}</p>
                        <p>Region: ${region}</p>
                        <p>Lat-Lng: ${latlng}</p>
                        <img src="${flag}" alt="Flag" width="100">
                    `;
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            console.log(data);
        });

    