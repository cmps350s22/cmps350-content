import fetch from "node-fetch";

// create a new "async" function so we can use the "await" keyword
async function getCountries(region) {
    const url = `https://restcountries.eu/rest/v1/region/${region}`;
    const response = await fetch( url );
    return await response.json();
}

function displayCountries(region, countries) {
    console.log(`Countries in ${region} and their capital city:`);
    countries.map(country => {
        console.log(`${country.name} - ${country.capital}`);
    });
}

const region = 'asia';
const countries = await getCountries(region);
displayCountries(region, countries);