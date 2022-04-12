//Imports
import {NavigatorRepo} from "./repo/navigator-repo.js";
import {injectQuranPage, openClickedQuarter, openClickedSurah, openClickedSurahXAya} from "./viewer-index.js";
import {ViewerRepo} from "./repo/viewer-repo.js";
import {MahawerRepo} from "./repo/mahawer-repo.js";

//Repo
const navigatorRepo = new NavigatorRepo();
const viewerRepo = new ViewerRepo();
const mahawerRepo = new MahawerRepo()

//DOM
const quranSectionView = document.querySelector('#quran-view');
const quranViewBtn = document.querySelector('#quran-view-button');
const quranNavBtn = document.querySelector('#quran-nav-button');


//Event Listeners
quranViewBtn.addEventListener('click', handleQuranNavChange);
quranNavBtn.addEventListener('click', handleQuranNavChange);

//OnLoad
window.onload = async () => {
    window.handleQuranNavChange = handleQuranNavChange;
    window.getJuzCards = getJuzCards;
    window.handleNavToggle = handleNavToggle;
    window.openClickedSurah = openClickedSurah;
    window.openClickedQuarter = openClickedQuarter;
    window.openClickedSurahXAya = openClickedSurahXAya;
    window.injectSurahMahawer = injectSurahMahawer;
    window.handlePageSearch = handlePageSearch;
    window.openCards = openCards;
    await mahawerRepo.getAllMahawer();
    await viewerRepo.getQuranPages();
    await viewerRepo.getQuranQuarters();
    await injectQuran();
}


//Listeners
async function handleQuranNavChange(e) {
    e.preventDefault();
    if (e.target.id === 'quran-view-button') {
        quranViewBtn.classList.add("chosen");
        quranNavBtn.classList.remove("chosen");

        //Inject quran view
        await injectQuran();
    } else if (e.target.id === 'quran-nav-button') {
        quranNavBtn.classList.add("chosen");
        quranViewBtn.classList.remove("chosen");

        //inject quran nav
        await injectQuranNav();
    }
}

async function handleNavToggle(toggle) {
    const cardSlideContainer = document.querySelector('#quran-nav-cards');
    cardSlideContainer.innerHTML = `${toggle.checked ? await getJuzCards() : await getSurahCards()}`;

    const input = document.querySelector('#page-search-number');
    if (toggle.checked) {
        input.style.background = 'var(--light-green)';
        input.style.color = 'white';
        input.style['border-color'] = 'grey';
    } else {
        input.style.background = 'var(--lighter-green)';
        input.style.color = 'var(--basaer-green)';
        input.style.border = '1px dashed var(--basaer-green)';
    }
}

async function handlePageSearch() {
    const input = document.querySelector('#page-search-number').value;
    const page = await viewerRepo.getQuranPageByIndex(Number(input));
    await injectQuranPage(page);
}

//HTML Modifiers

async function injectQuran() {
    await openClickedSurah(1);
}

async function injectQuranNav() {
    const cards = await getJuzCards();
    quranSectionView.innerHTML = `
        <div class="quran-navigation-container" id="quran-navigation-container">
            <section class="page-search-form toggle-search-container">
                <!--toggle-->
                <label class="juz-sowar-toggle" id="juz-sowar-toggle" for="juz-sowar-toggle__input">
                    <input id="juz-sowar-toggle__input" class="juz-sowar-toggle__input" type="checkbox" checked onchange="handleNavToggle(this)">
                    <div class="toggle-fill"></div>
                </label>
            
                <!--Seach bar-->
                <div class="page-search-bar">
                    <button type="submit" class="page-search-button" onclick="handlePageSearch()">
                        <i class="fas fa-search fa-xl page-search-icon" id="search-icon"></i>
                    </button>
                    <input id="page-search-number" type="number" min="1" max="604" name="search-name" class="page-search-bar-txt" placeholder="رقم الصفحة"">
                </div>
            </section>
            
            <!--juzs vertical slider-->
            <main id="quran-nav-cards" class="sliding-cards-container">
                ${cards}
            </main>
        </div>
    `;
    const input = document.querySelector('#page-search-number');
    input.style.background = 'var(--light-green)';
    input.style.color = 'white';
    input.style['border-color'] = 'grey';
}

async function getJuzCards() {
    const cards = await navigatorRepo.getQuranJuzs();
    return await cards.map(o => juzCardHTMLTemplate(o)).join('\n');
}

async function getSurahCards() {
    const surahs = await navigatorRepo.getQuranSuwar();
    const cards = [];

    let currentJuz = 0
    for (let i = 0; i < surahs.length; i++) {
        if (currentJuz < surahs[i]['juz']) {
            let juz = await navigatorRepo.getQuranJuzById(surahs[i]['juz']);
            cards.push(juzHeaderHTMLTemplate(juz));
            currentJuz = surahs[i]['juz'];
        }
        cards.push(surahCardHTMLTemplate(surahs[i]));
    }

    return cards.join('\n');
}

//HTML Templates
function juzCardHTMLTemplate(juz) {
    return `
        <section class="card juz-card">
            <section class="card-title">
                <h3 class="english-juz-number">${juz.name['english']}</h3>
                <h3 class="arabic-juz-number">${juz.name['arabic']}</h3>
            </section>
            <hr>
            <section class="card-content">
                <ul class="hizb-list">
                    <li id="${juz.index}" onclick="openClickedQuarter({juz: ${juz.index}, hizb: 1, quarter: 4})"><a href="#${juz.index}">3/4</a></li>
                    <li id="${juz.index}" onclick="openClickedQuarter({juz: ${juz.index}, hizb: 1, quarter: 3})"><a href="#${juz.index}">1/2</a></li>
                    <li id="${juz.index}" onclick="openClickedQuarter({juz: ${juz.index}, hizb: 1, quarter: 2})"><a href="#${juz.index}">1/4</a></li>
                    <li id="${juz.index}" onclick="openClickedQuarter({juz: ${juz.index}, hizb: 1, quarter: 1})"><a href="#${juz.index}">الحزب الاول</a></li>
                </ul>
                <ul class="hizb-list">
                    <li id="${juz.index}" onclick="openClickedQuarter({juz: ${juz.index}, hizb: 2, quarter: 4})"><a href="#${juz.index}">3/4</a></li>
                    <li id="${juz.index}" onclick="openClickedQuarter({juz: ${juz.index}, hizb: 2, quarter: 3})"><a href="#${juz.index}">1/2</a></li>
                    <li id="${juz.index}" onclick="openClickedQuarter({juz: ${juz.index}, hizb: 2, quarter: 2})"><a href="#${juz.index}">1/4</a></li>
                    <li id="${juz.index}" onclick="openClickedQuarter({juz: ${juz.index}, hizb: 2, quarter: 1})"><a href="#${juz.index}">الحزب الثاني</a></li>
                </ul>
            </section>
        </section>
    `;
}

function juzHeaderHTMLTemplate(juz) {
    return `
        <section class="card juz-header">
            <p>${juz.name['english']}</p>
            <p>${juz.name['arabic']}</p>
        </section>
    `;
}

function surahCardHTMLTemplate(surah) {
    return `
        <section class="card surah-card" id="surah-card" onclick="openClickedSurah(${surah.id})">
            <p id="${surah.id}" class="surah-card-number">${surah.id}</p>
            <section class="surah-card-names">
                <p >${surah['englishName']}</p>
                <a href="#" class="icon-container" onclick="injectSurahMahawer(${surah.id}, event)">
                    <i class="fa-solid fa-folder-tree mahawer-icon"></i>
                </a>
                <p>${surah['name']}</p>
            </section>
        </section>
    `;
}

async function injectSurahMahawer(surahID, e) {
    e.preventDefault()
    e.stopPropagation()
    const mahawer = (await mahawerRepo.getSurahAndMahawerById(surahID));
    quranViewBtn.classList.add("chosen");
    quranNavBtn.classList.remove("chosen");
    quranSectionView.innerHTML = `
        <div class="all-mahawer-container">
            ${moqademaToHTML(surahID, mahawer["moqadema"])}
            ${mahawer["mahawer"].map(m => mehwarToHTML(surahID, m)).join('\n')}
        </div>
    `;
}

function moqademaToHTML(surahID, moqadema) {
    return `
        <div class="mehwar-card" id="moqadema-card">
            <div onclick="openCards(this)" class="collapsed-mehwar-card">
                <h3 class="collapsed-mehwar-counter" id="moqadema-counter">المقدمة</h3>
                <p class="collapsed-mehwar-text" id="moqadema-title">
                    ${moqadema.title}
                    <p class="collapsed-mehwar-range" id="moqadema-range">${moqadema.range}</p>
                </p>
            </div>
            <article class="mehwar-aqsam">
       ${moqadema['sections'].map(s => sectionToHTML(surahID, s)).join('\n')}
         </article> 
       </div>    
`
}

function mehwarToHTML(surahID, mehwar) {
    return `
        <div class="mehwar-card">
            <div onclick="openCards(this)" class="collapsed-mehwar-card">
                <h3 class="collapsed-mehwar-counter" id="axle-initial-counter-mehawer">  المحور ${mehwar.counter}</h3>
                <h2 class="collapsed-mehwar-title" id="axle-initial-title-mehawer">${mehwar.title}</h2>
                <p class="collapsed-mehwar-text" id="axle-initial-text">
                    ${mehwar.text}
                    <p class="collapsed-mehwar-range" id="axle-initial-range-mehawer">${mehwar.range}</p>
                </p>
            </div>
            <article class="mehwar-aqsam">
                ${mehwar['sections'].map(s => sectionToHTML(surahID, s)).join('\n')}
            </article> 
       </div>
    `;
}

function sectionToHTML(surahID, section) {
    return `
        <section class="qesm-section">
            <a  class="qesm-anchor" id="sub-axle-header" href="#" onclick="
                openClickedSurahXAya(${surahID}, ${section.startAya})">
                <h4 class="qesm-header">القسم ${section.id}</h4>
            </a>
            <p class="qesm-text"> 
                ${section.text}
                <p class="qesm-range">
                    [
                        ${
        section.startAya === section.endAya ?
            section.startAya : section.startAya + '-' + section.endAya
    }
                    ]
                </p>
            </p>
        </section>
    `;
}

function openCards(card) {
    card.classList.toggle('card-clicked-mehawer');
    const sibling = card.nextElementSibling;
    const height = sibling.scrollHeight;

    if (card.classList.contains('card-clicked-mehawer'))
        sibling.style.maxHeight = `${height}px`;
    else
        sibling.style.maxHeight = "0px";
}
