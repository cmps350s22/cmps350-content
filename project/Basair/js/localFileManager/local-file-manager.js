//Paths
const juzsJsonPath = '../../json/juzs.json';
const suwarJsonPath = '../../json/surahs.json';
const ayaatJsonPath = '../../json/verses.json';
const quarterJsonPath = '../../json/quaters.json';
const quranTafsirPath= '../../json/tasfir.json';
const pagesJsonPath = '../../json/pages.json'
const axisJsonPath= "../../json/quran-mahawer.json";

export class LocalFileManager {
    getJuzs () {
        return fetch(juzsJsonPath).then(response => response.json());
    }
    getSuwar() {
        return fetch(suwarJsonPath).then(response => response.json());
    }
    getAyaat(){
        return fetch(ayaatJsonPath).then(response => response.json());
    }
    getQuarters(){
        return fetch(quarterJsonPath).then(response => response.json());
    }
    getTafsir(){
        return fetch(quranTafsirPath).then(response => response.json());
    }
    getPages(){
        return fetch(pagesJsonPath).then(response => response.json());
    }
    getAxis () {
        return fetch(axisJsonPath).then(response => response.json())
    }
}