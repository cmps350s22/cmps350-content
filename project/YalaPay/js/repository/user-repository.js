const db = new Localbase("user.db");
const userCollection = "users";

class UserRepository {
    getUsers() {
        return db.collection(userCollection).get();
    }

    getUser(email) {
        return db.collection(userCollection).doc({ email: email }).get();
    }

    async addUsers() {
        const url = "data/users.json";
        const response = await fetch(url);
        const users = await response.json();
        for (const user of users) {
            if(!this.getUser(user.email))
                await db.collection(userCollection).add(user);
        }
    }
}

export default new UserRepository();