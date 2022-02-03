const digitName = function () {
    const names = [
        "zero", "one", "two", "three", "four",
        "five", "six", "seven", "eight", "nine"
    ];

    return function (n) {
        return names[n];
    };
};

const getDigitName = digitName();
console.log(getDigitName(3));    // "three"
console.log(getDigitName(9));    // "nine"


//Data Encapsulation through Closure
//Avoids the use of Global Variables
function makeCounter() {
    let i = 0;
    return function () {
        return ++i;
    }
}

const counter = makeCounter();
console.log( counter() ); // 1
console.log( counter() ); // 2
