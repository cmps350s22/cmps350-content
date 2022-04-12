//Imports
import {ViewerRepo} from "./repo/viewer-repo.js";
import {MahawerRepo} from "./repo/mahawer-repo.js";
import {NavigatorRepo} from "./repo/navigator-repo.js";

//Repo
const viewerRepo = new ViewerRepo();
const mahawerRepo = new MahawerRepo();
const navigatorRepo = new NavigatorRepo();

//DOM
const quranSectionView = document.querySelector('#quran-view');
const quranViewBtn = document.querySelector('#quran-view-button');
const quranNavBtn = document.querySelector('#quran-nav-button');

//OnLoad
window.onload = async () => {
    window.openClickedSurah = openClickedSurah;
    window.openClickedQuarter = openClickedQuarter;
    window.injectQuranPage = injectQuranPage;
}

//Methods
export async function openClickedSurahXAya(suraId, aya) {
    const page = await viewerRepo.getQuranPageBySurahAyaId(suraId, aya);
    await injectQuranPage(page);
}

export async function openClickedSurah(surahId) {
    if (surahId < 1 || surahId > 604) return;
    await viewerRepo.getSurahAyaat();
    await viewerRepo.getQuranTafsir();
    await viewerRepo.getQuranPages();
    await navigatorRepo.getQuranSuwar();
    await mahawerRepo.getAllMahawer();
    await navigatorRepo.getQuranJuzs();
    const surahPage = await viewerRepo.getQuranPageBySurahId(surahId);
    await injectQuranPage(surahPage);
}

function ayaatToHTML(tafsir, aya) {
    return `
        <tr>
            <td class="summary-text-qesm">
                <p class="qesm-summary-title">${tafsir}</p>
                <ul class="aya-nav">
                        <li class="aya-nav-li"><a class="aya-nav-a" href="#">تصميم جرافيك</a></li>
                        <li class="aya-nav-li"><a class="aya-nav-a" href="#">فيديو</a></li>
                        <li class="aya-nav-li"><a class="aya-nav-a" target="_blank" href="https://everyayah.com/">تفسير</a></li>
                        <li class="aya-nav-li"><a class="aya-nav-a" href="#">بصائر</a></li>
                    </ul>
                </td>
            <td class="aya" id="${aya.id}">
                ${aya.text}
                (${aya.id})
            </td>
        </tr>
    `;
}

export async function openClickedQuarter(customJuz) {
    const quarterIndex = 8 * customJuz.juz + 4 * customJuz['hizb'] + customJuz['quarter'] - 12; // the index of that quarter in the json
    const quarterObj = await viewerRepo.getQuranQuarterByIndex(quarterIndex);
    const page = await viewerRepo.getQuranPageBySurahAyaId(quarterObj['sura'], quarterObj['aya']);

    await injectQuranPage(page);
}

export async function injectQuranPage(page) {
    let surahTables = "";
    for (let i = page.startingSura; i <= page.endingSura; i++) {
        const suraObj = await viewerRepo.getSurahAyaatById(i);
        const suraVersesObjList = suraObj['verses'];
        const surahXMehwarObj = await mahawerRepo.getSurahAndMahawerById(i);

        if (surahXMehwarObj) {
            const surahSections = surahXMehwarObj['mahawer'].map(m => m['sections']).flat(Infinity);
            let ayaatXSections = '';
            for (let j = 0; j < surahSections.length; j++) {
                if ((surahSections[j]['startAya'] >= page.startingAya && surahSections[j]['startAya'] <= page.endingAya)
                    || (surahSections[j]['startAya'] < page.startingAya && surahSections[j]['endAya'] > page.startingAya)) {
                    ayaatXSections += ayaatXSectionHTML(ayaatXSections = suraVersesObjList.slice(surahSections[j]['startAya'] - 1, Math.min(surahSections[j]['endAya'], page.endingAya))
                            .map(v => `(${v.id})${v.text}`)
                            .join(''),
                        surahSections[j].text);
                    if (surahSections[j]['endAya'] >= page.endingAya) break;
                }
            }

            //If sections don't cover all surah ayas
            const lastAyaInSection = surahSections[surahSections.length - 1]['endAya'];
            const endAya = i === page.endingSura ? page.endingAya : suraVersesObjList.length;
            if (endAya > lastAyaInSection) {
                const ayaatTafseerObj = (await viewerRepo.getQuranTafsirById(i.toString()))['ayat'];
                ayaatXSections += suraVersesObjList.slice(Math.max(lastAyaInSection, page.startingAya - 1), endAya)
                    .map(a => ayaatXSectionHTML(`${a.text}(${a.id})`, ayaatTafseerObj[a.id - 1].text))
                    .join('\n')
            }

            surahTables += `
                <table class="main-table-viewer">
                    <tr class="sura-name-header">
                        <h1 class="head-title-viewer">
                            سورة ${suraObj.name} 
                        </h1>
                    </tr>
                    ${page.startingAya === 1 ?
                surahXMehwarObj['moqadema']['sections'].map(s =>
                    ayaatXSectionHTML(
                        suraVersesObjList.slice(Math.max(s['startAya']) - 1, s['endAya'])
                            .map(v => `(${v.id})${v.text}`)
                            .join(''),
                        s.text
                    )
                ).join('')
                : ''
            }
                    ${ayaatXSections}           
                </table>
            `;

        } else {
            let surahAyaatObj = await viewerRepo.getSurahAyaatById(i);
            const surahTafseer = await viewerRepo.getQuranTafsirById(i.toString());

            const startAya = i === page.startingSura ? page.startingAya - 1 : 0;
            const endAya = i === page.endingSura ? page.endingAya : suraVersesObjList.length;
            surahTables += `
                <table class="main-table-viewer">
                    <tr class="sura-name-header">
                        <h1 class="head-title-viewer">
                            سورة ${suraObj.name} 
                        </h1>
                    </tr>
                    ${
                surahAyaatObj['verses'].slice(startAya, endAya)
                    .map(sao => ayaatToHTML(surahTafseer['ayat'][sao.id - 1].text, sao))
                    .join('')
            }
                    
                </table>
            `;
        }
    }
    quranSectionView.innerHTML = `
        <header class="header-viewer">
            <i class="fa-solid fa-arrow-left arrow-viewer"></i>
            <h1 class="head-title-viewer">
                 (صفحة ${page.index})
            </h1>
            <i class="fa-solid fa-arrow-right arrow-viewer"></i>
        </header>
        <main class="main-viewer">
                ${surahTables}
        </main>
    `;
    quranViewBtn.classList.add("chosen");
    quranNavBtn.classList.remove("chosen");

    const nextPage = await viewerRepo.getQuranPageByIndex(page.index + 1);
    const previousPage = await viewerRepo.getQuranPageByIndex(page.index - 1);
    document.querySelector('.fa-arrow-left').addEventListener('click', function () {
        injectQuranPage(nextPage);
    });
    document.querySelector('.fa-arrow-right').addEventListener('click', function () {
        injectQuranPage(previousPage);
    });
}

function ayaatXSectionHTML(sectionVersesObjList, sectionText = "-") {
    return `
        <tr>
            <td class="summary-text-qesm">
                <p class="qesm-summary-title">${sectionText}</p>
                <ul class="aya-nav">
                    <li class="aya-nav-li"><a class="aya-nav-a" href="#">تصميم جرافيك</a></li>
                    <li class="aya-nav-li"><a class="aya-nav-a" href="#">فيديو</a></li>
                    <li class="aya-nav-li"><a class="aya-nav-a" target="_blank" href="https://everyayah.com/">تفسير</a></li>
                    <li class="aya-nav-li"><a class="aya-nav-a" href="#">بصائر</a></li>
                </ul>
            </td>    
            <td class="aya">
                ${sectionVersesObjList}
            </td>
        </tr>
    `;
}
