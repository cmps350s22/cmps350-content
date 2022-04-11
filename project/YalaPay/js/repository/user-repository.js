const db = new Localbase("YalaPay.db");

class UserRepository {
    getUsers() {
        return db.collection("users").get();
    }

    async getUsersCount() {
        // Localbase = very poor library, it does NOT have a function to just return documents count
        const users = await this.getUsers();
        const count = users.length;
        return (count !== null && count !== undefined) ? count : 0;
    }

    getUser(email, password) {
        return db.collection("users").doc({ email: email, password: password }).get();
    }

    async initUsers() {
        const usersCount = await this.getUsersCount();
        console.log(`Users count: ${usersCount}`);

        if (usersCount === 0) {
            const userUrl = "data/users.json";
            const response = await fetch(userUrl);
            const users = await response.json();
            for (const user of users) {
                await db.collection("users").add(user);
            }
        }
    }
}

export default new UserRepository();