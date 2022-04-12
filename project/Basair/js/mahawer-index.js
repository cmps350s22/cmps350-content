const main = document.querySelector(".main-container-mehawer");
import {MahawerRepo} from "./repo/mahawer-repo.js";

const mahawerRepo = new MahawerRepo();

window.onload = async () => {
    window.openCards = openCards;
    await addMahawerToHtml(4);
}

async function addMahawerToHtml(surahID) {
    const data = await mahawerRepo.getAllMahawer();
    main.innerHTML = data[surahID - 1].mahawer.map(m => convertMahawerToCard(m)).join('\n');
}

function convertMahawerToCard(axis) {
    let card = `<div class="card-mehawer">
    <div onclick="openCards(this)" class="collapsible-card-initial-mehawer">
        <h3 class="axle-initial-counter-mehawer" id="axle-initial-counter-mehawer">  المحور ${axis.counter}</h3>
        <h2 class="axle-initial-title-mehawer" id="axle-initial-title-mehawer">${axis.title}</h2>
        <p class="axle-initial-text-mehawer" id="axle-initial-text-mehawer">
            ${axis.text}
            <p class="axle-initial-range-mehawer" id="axle-initial-range-mehawer">${axis.range}</p>
        </p>
    </div>
         <article class="collapsible-card-content-mehawer">
`

    for (let i = 0; i < axis.sections.length; i++) {
        card += `<section class="sub-axle-section-mehawer">
         <a id="sub-axle-header-mehawer" href="#quran-view">
             <h4 class="sub-axle-header-mehawer">القسم ${axis.sections[i].id}</h4>
         </a>`
        if (axis.sections[i].startAya === axis.sections[i].endAya) {
            card += `
        <p class="sub-axle-content-mehawer"> ${axis.sections[i].text}<p
            class="sub-axle-range-mehawer">[${axis.sections[i].startAya}]</p>
             </p>
            `
        } else {
            card += `
        <p class="sub-axle-content-mehawer"> ${axis.sections[i].text}<p
            class="sub-axle-range-mehawer">[${axis.sections[i].startAya}-${axis.sections[i].endAya}]</p>
             </p>
            `
        }
        card += `
             </section>
          `


    }
    card += `  </article> 
         </div>`
    return card;
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


