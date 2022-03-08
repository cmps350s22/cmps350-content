import * as heroRepository  from './hero-repository.js';

//After the document is loaded in the browser
document.addEventListener("DOMContentLoaded", async () => {
    await displayHeroes();

    document.querySelector('#heroTypeFilter').addEventListener('change', async function() {
        const heroType = this.value;
        await displayHeroes(heroType);
    });

    /*
       Because we set type='module' in <script type="module" src="./app.js"></script>
       Attach these functions to the window object to make
       them available to the html page.
       Or use addEventListener to bind handler.
     */
    window.onAddHero = onAddHero;
    window.onUpdateHero = onUpdateHero;
    window.onSubmitHero = onSubmitHero;
    window.onDeleteHero = onDeleteHero;
});

async function getHeroForm() {
    const url = `hero-form.html`;
    const response = await fetch(url);
    return await response.text();
}

/*****************************
 Functions to handle UI Events
 *****************************/
//region UI Event Handlers
async function displayHeroes(heroType) {
    try {
        log(''); // Clear any error message displayed on the screen
        let heroes;
        if (heroType) {
            heroes = await heroRepository.getHeroesByType(heroType);
        } else {
            heroes = await heroRepository.getHeroes();
        }
        //console.log(heroes);
        const heroesDiv = document.querySelector("#heroes");
        heroesDiv.innerHTML = heroes2Html(heroes);
    } catch (e) {
        log(e);
    }
}

export async function onUpdateHero(event, heroId) {
    event.preventDefault();
    //console.log("heroId:", heroId, event);

    const heroesDiv = document.querySelector("#heroes");
    const heroForm = await getHeroForm();
    heroesDiv.innerHTML = heroForm;

    const hero = await heroRepository.getHero(heroId);

    //Fill the form field with the hero data fetched from the Web API
    document.querySelector("#id").value = hero.id;
    document.querySelector("#name").value = hero.name;
    document.querySelector("#heroType").value = hero.heroType;
    document.querySelector("#quote").value = hero.quote;
}

export async function onAddHero(event) {
    event.preventDefault();
    log(''); // Clear any error message displayed on the screen
    const heroesDiv = document.querySelector("#heroes");
    const heroForm = await getHeroForm();
    heroesDiv.innerHTML = heroForm;
}

export async function onSubmitHero(event) {
    const form = event.target.form;
    const isFormValid = form.checkValidity();
    if (!isFormValid) return;

    //Prevent the submit button default behavior
    event.preventDefault();

    const hero = formToObject(form);
    console.log(hero);
    //ToDo: Make API call to add/update hero
    if (hero.id) {
        hero.id = parseInt(hero.id)
        await heroRepository.updateHero(hero);
    } else {
        await heroRepository.addHero(hero);
    }
    //return to the home page
    window.location.href = "index.html";
}

export async function onDeleteHero(id) {
    const confirmed = confirm(`Are you sure you want to delete hero #${id}?`);
    if (confirmed) {
        // Delete hero by Id from localStorage
        await heroRepository.deleteHero(id);
        document.querySelector(`tr[data-hero-id='${id}']`).remove();
    }
}
//endregion


/*****************************
 Helper Functions
 *****************************/
//region Helper Functions
function formToObject(form) {
    // Construct key/value pairs representing form fields and their values,
    const formData = new FormData(form);
    let formObject = {};

    // Convert key/value pairs to an object
    formData.forEach( (value, key) => {
        formObject[key] = value;
    });

    return formObject;
}

function log(err) {
    if (err != '') {
        console.error(err);
    }
    const message = err.message || err;
    let messagesDev = document.querySelector("#errorMsg");
    messagesDev.innerHTML = message;
}

function heroes2Html(heroes) {
    const html = `
        <h2>Heroes</h2>
        <table id="heroesTable">
            ${ heroes.map( hero =>
            `<tr data-hero-id='${hero.id}'>
                <td>
                    <a href="#" onclick="onUpdateHero(event, ${hero.id})">
                        ${hero.name}
                    </a>
                </td>
                <td> ${hero.heroType} </td>
                <td align="right">
                    ${hero.quote}
                </td>
                <td>
                    <i style="color: indianred; cursor: pointer" title="Delete hero" 
                        class="fas fa-user-times" onclick="onDeleteHero(${hero.id})">
                    </i>
                </td>
            </tr>`).join('') 
            }
        </table>`;

    return html;
}
//endregion