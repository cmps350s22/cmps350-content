let valueDouble = 8.75;
const valueInt = valueDouble | 0; // 8
console.log("valueDouble = " + valueDouble);
console.log("valueInt = " + valueInt);

valueDouble = 8.75;
const roundedInt = (valueDouble + 0.5) | 0; // 9
console.log("valueDouble = " + valueDouble);
console.log("roundedInt = " + roundedInt);

//Use number’s method (toString)
let num = 100;
let str = num.toString();
console.log("str = ", str, "typeof str is ", typeof str);

//Use String function
str = String(num);
console.log("str = ", str, "typeof str is ", typeof str);

str = "1234";
num =  parseInt(str) + 1; // 1235
console.log("str = ", str, "typeof str is ", typeof str);
console.log("num = ", num);
