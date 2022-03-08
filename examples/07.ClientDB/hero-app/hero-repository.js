import { openDB, deleteDB } from 'https://unpkg.com/idb?module';

const dbName = 'heroes-db';   // string, database name
const dbVersion = 1;   // integer, YOUR database version (not IndexedDB version)
const heroesStoreName = 'heroes';  // Name of your collection of documents

async function fetchHeroes() {
    const url = './data/hero.json';
    const response = await fetch(url);
    return await response.json();
}

async function getDB() {
    /* Delete a database. Useful in development when
       you want to initialize your database schema. */
    //await deleteDB(dbName);

    /* The upgrade callback only runs ONE time per database version.
       - use db.createObjectStore to create object stores
          # keyPath: specify the primary key for each object in the object store.
          # Set autoIncrement to true if you want IndexedDB to handle primary key generation
       - Use it store.createIndex to create an index => to speed-up queries by properties
         other than the primary key
       In IndexedDB, an index is just another "shadow store" that's based off the main store.
       Adding an index is like creating the same store with a different 'keyPath'.
       Just like how the main store is auto sorted by the primary key, the index store is
       auto sorted by the index key.
    */
    const db = await openDB('heroes-db', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('heroes')) {
                    const heroesStore = db.createObjectStore('heroes', {
                        keyPath: 'id', autoIncrement: true,
                    });

                    heroesStore.createIndex('heroTypeIndex', 'heroType');
                }
            },
        }
    );
    /****************************************
     *** Init DB with data from JOSN file ***
     ****************************************/
    const heroesCount = await db.count(heroesStoreName);
    if (heroesCount === 0) {
        const heroes = await fetchHeroes();
        heroes.forEach(async hero => await addHero(hero));
    }
    return db;
}

export async function getHeroes() {
    const db = await getDB();
    return await db.getAll(heroesStoreName);
}

export async function getHero(heroId) {
    const db = await getDB();
    return await db.get(heroesStoreName, heroId);
}

export async function addHero(hero) {
    // Remove the hero id to ensure that the database will auto-assign an id
    //delete hero.id;
    const db = await getDB();
    // Returns the id assigned by the database
    const heroId = await db.add(heroesStoreName, hero);
    //hero.id = heroId;
    //await updateHero(hero);
    console.log(heroId)
    return heroId;
}

export async function updateHero(hero) {
    const db = await getDB();
    await db.put(heroesStoreName, hero);
}

export async function deleteHero(heroId) {
    const db = await getDB();
    await db.delete(heroesStoreName, heroId);
}

export async function getHeroesByType(heroType) {
    const db = await getDB();
    // Get all using the index to return objects where the index value = heroType
    return await db.getAllFromIndex(heroesStoreName, 'heroTypeIndex', heroType);
}

//getHeroesById(5, 10)
export async function getHeroesById(fromId, toId) {
    const db = await getDB();
    let range;
    if (fromId && toId)
        range = IDBKeyRange.bound(fromId, toId); // key between fromId and toId
    else if (fromId)
        range = IDBKeyRange.lowerBound(fromId); // key >= fromId
    else if (toId)
        range = IDBKeyRange.upperBound(toId);  // key <= toId

    return await db.getAll(heroesStoreName, range);

}

/* Other
 - db.getAllKeys(...) : return a store keys
 - db.deleteObjectStore(...) : delete a store
*/