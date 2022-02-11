// Named Exports
// public exposed function
export function sum(...args) {
    //log('sum', args);
    return args.reduce((num, sum) => sum + num);
}

export function multiply(...args) {
    //log('multiply', args);
    return args.reduce((num, product) => product * num);
}

// private function
function log(...msg) {
    console.log(...msg);
}

// Another way of doing it
//export {add, multiply}

class UserIdGenerator {
    #prefix = 99;
    next() {
        this.#prefix++;
        return `${this.#prefix}${new Date().getFullYear()}`;
    }
}
// Default Export
export default new UserIdGenerator();