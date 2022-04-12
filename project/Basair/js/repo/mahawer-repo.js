import {LocalFileManager} from "../localFileManager/local-file-manager.js";

const localFileMgr = new LocalFileManager();
const db = new Localbase('db')

export class MahawerRepo {

    async addMehwar(axis) {
        try {
            return db.collection('quran-mahawer').add(axis);
        } catch (e) {
            console.log(e);
        }
    }

    async getAllMahawer() {
        try {
            let response = await db.collection('quran-mahawer').get();
            if (response.length === 0) {
                const allAxis = await localFileMgr.getAxis();
                allAxis.forEach(axis => this.addMehwar(axis));
                response = db.collection('quran-mahawer').get();
            }
            return response;
        } catch (e) {
            console.log(e);
        }
    }

    async getSurahAndMahawerById(surahID) {
        try {
            return await db.collection('quran-mahawer').doc({surahID}).get();
        } catch (e) {
            console.log(e)
        }
    }
}
