class User {
    // Random number between 0 and 100
    #randomPrefix = Math.floor(Math.random() * 100);
    #id = `${this.#randomPrefix}${new Date().getFullYear()}`;
    constructor(name) {
        this.name = name;
    }
    get userId() {
        return this.#id;
    }
}

const user1 = new User("Juha Dahak");
console.log(user1.userId, user1.name);
// Accessing a private attribute causes a syntax error
console.log(user1.#id);