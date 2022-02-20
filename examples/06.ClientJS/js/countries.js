document.addEventListener("DOMContentLoaded", ()=> {
    const regionDD = document.querySelector('#regionDD');
    regionDD.value = 'asia';
    handleRegionChange('asia');
});

async function getCountries(region) {
    const url = `https://restcountries.eu/rest/v2/region/${region}`;
    const response = await fetch(url);
    return await response.json();
}

async function handleRegionChange(region) {
    //console.log(event);
    //const region = event.target.value;
    console.log(region);
    const countries = await getCountries(region);
    console.log(countries);

    // AJAX
    const countriesUL = document.querySelector('#countriesList');
    const countriesHtml = `${ countries.map(c => `<li>${c.name} (${c.capital}) </li>`).join('\n')}`;
    countriesUL.innerHTML = countriesHtml;
}