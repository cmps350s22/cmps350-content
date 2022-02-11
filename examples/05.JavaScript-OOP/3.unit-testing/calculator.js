class Calculator {
    add = (x, y) => x + y;
    subtract = (x, y) => x - y;
    multiply = (x, y) => x * y;
    divide = (x, y) => {
        if (y === 0) {
            throw "Invalid input";
        } else {
            return x / y
        }
    }
}

// Default Export
export default new Calculator();
