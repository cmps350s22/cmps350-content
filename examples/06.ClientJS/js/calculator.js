class Calculator {
    add (a, b) {
        return a + b;
    }

    subtract (a, b) {
        return a - b;
    }

    mutiply (a, b) {
        return a * b;
    }

    divide (a, b) {
        return a / b;
    }

    compute(num1, num2, operation) {
        let result;
        switch(operation) {
            case '+' :
                result = this.add(num1, num2);
                break;
            case '-' :
                result = this.subtract(num1, num2);
                break;
            case '*' :
                result = this.mutiply(num1, num2);
                break;
            case '/' :
                result = this.divide(num1, num2)
                break;
        }
        return result;
    }
}

export default new Calculator();