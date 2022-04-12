import {LocalFileManager} from "../localFileManager/local-file-manager.js";

const localFileMgr = new LocalFileManager();
const db = new Localbase('db')

export class ViewerRepo {

    async getQuranPageByIndex(index) {
        if (index < 1) {
            return await db.collection('pages').doc({index: 1}).get();
        }
        try {
            let page = await db.collection('pages').doc({index}).get();
            if (!page) {
                await this.uploadAllQuranPages();
                page = await db.collection('pages').doc({index}).get();
            }
            return page;
        } catch (e) {
            console.log(e);
        }
    }

    async getQuranPageBySurahId(surahId) {
        try {
            let pages = await db.collection('pages').orderBy('startingSura').get();
            if (pages.length === 0) {
                await this.uploadAllQuranPages();
                pages = await db.collection('pages').orderBy('startingSura').get();
            }
            pages = pages.sort((p1, p2) => p1.startingSura - p2.startingSura);

            for (let i = 0; i < pages.length - 1; i++)
                if (pages[i].startingSura <= surahId && surahId <= pages[i].endingSura)
                    return pages[i];
            return pages.pop();
        } catch (e) {
            console.log(e)
        }
    }

    async getQuranPageBySurahAyaId(surahId, aya) {
        try {
            let pages = await db.collection('pages').orderBy('startingSura').get();
            if (pages.length === 0) {
                await this.uploadAllQuranPages();
                pages = await db.collection('pages').orderBy('startingSura').get();
            }
            pages.sort((p1, p2) => p1.startingSura - p2.startingSura)

            for (let i = 0; i < pages.length - 1; i++) {
                if ((pages[i].startingSura === surahId) && (pages[i].startingAya > aya))
                    return pages[i - 1];
                else if (surahId < pages[i].startingSura)
                    return pages[i - 1];
            }
            return pages.pop();
        } catch (e) {
            console.log(e)
        }
    }

    async addQuranPages(page) {
        try {
            return db.collection('pages').add(page);
        } catch (e) {
            console.log(e);
        }
    }

    async getQuranPages() {
        try {
            let response = await db.collection('pages').get();
            if (response.length === 0) {
                await this.uploadAllQuranPages();
                response = db.collection('pages').get();
            }
            return response;
        } catch (e) {
            console.log(e);
        }
    }

    async uploadAllQuranPages() {
        const pages = await localFileMgr.getPages();
        pages.forEach(j => this.addQuranPages(j));
    }

    async addQuranAyaat(surah) {
        try {
            return db.collection('ayaat').add(surah);
        } catch (e) {
            console.log(e);
        }
    }

    async getSurahAyaat() {
        try {
            let response = await db.collection('ayaat').get();
            if (response.length === 0) {
                const ayaat = await localFileMgr.getAyaat();
                ayaat.forEach(j => this.addQuranAyaat(j));
                response = db.collection('ayaat').get();
            }
            return response;
        } catch (e) {
            console.log(e);
        }
    }

    async getSurahAyaatById(id) {
        try {
            return db.collection('ayaat').doc({id: id}).get();
        } catch (e) {
            console.log(e)
        }
    }

    async addQuranQuarter(quarter) {
        try {
            return db.collection('quarters').add(quarter);
        } catch (e) {
            console.log(e);
        }
    }

    async getQuranQuarters() {
        try {
            let response = await db.collection('quarters').get();
            if (response.length === 0) {
                const quarters = await localFileMgr.getQuarters();
                quarters.forEach(j => this.addQuranQuarter(j));
                response = db.collection('quarters').get();
            }
            return response;
        } catch (e) {
            console.log(e);
        }
    }

    async getQuranQuarterByIndex(index) {
        try {
            let response = await db.collection('quarters').doc({index}).get();
            if (!response) {
                const quarters = await localFileMgr.getQuarters();
                quarters.forEach(j => this.addQuranQuarter(j));
                response = await db.collection('quarters').doc({index}).get();
            }
            return response;
        } catch (e) {
            console.log(e)
        }
    }

    async getQuranTafsir() {
        try {
            let response = await db.collection('tafsir').get();
            if (response.length === 0) {
                const tafseer = await localFileMgr.getTafsir();
                tafseer.forEach(j => this.addQuranTafsir(j));
                response = db.collection('tafsir').get();
            }
            return response;
        } catch (e) {
            console.log(e);
        }
    }

    async addQuranTafsir(tafsir) {
        try {
            return db.collection('tafsir').add(tafsir);
        } catch (e) {
            console.log(e);
        }
    }

    async getQuranTafsirById(id) {
        try {
            return db.collection('tafsir').doc({index: id}).get();
        } catch (e) {
            console.log(e)
        }
    }
}
