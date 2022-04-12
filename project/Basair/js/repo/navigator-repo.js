import {LocalFileManager} from "../localFileManager/local-file-manager.js";

//Libraries
const localFileMgr = new LocalFileManager();
const db = new Localbase('db')

export class NavigatorRepo {

    // Juz Cards
    addQuranJuz(juz) {
        try {
            return db.collection('juzs').add(juz);
        } catch (e) {
            console.log(e);
        }
    }

    async getQuranJuzs() {
        try {
            let response = await db.collection('juzs').get();
            if (response.length === 0) {
                const juzs = await localFileMgr.getJuzs();
                juzs.forEach(j => this.addQuranJuz(j));
                response = db.collection('juzs').get();
            }
            return response;
        } catch (e) {
            console.log(e);
        }
    }

    async getQuranJuzById(id) {
        try {
            return db.collection('juzs').doc({index: id}).get();
        } catch (e) {
            console.log(e)
        }
    }

    // Suwar Cards
    addQuranSurah(surah) {
        try {
            return db.collection('suwar').add(surah);
        } catch (e) {
            console.log(e);
        }
    }

    async getQuranSuwar() {
        try {
            let response = await db.collection('suwar').get();
            if (response.length === 0) {
                const suwar = await localFileMgr.getSuwar();
                suwar.forEach(s => this.addQuranSurah(s));
                response = db.collection('suwar').get();
            }
            return response;
        } catch (e) {
            console.log(e);
        }
    }
}
