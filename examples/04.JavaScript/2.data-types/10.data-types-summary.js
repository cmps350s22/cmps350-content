const string = 'Hello', int = 254;
const float = 25.4;
const bigint = BigInt(3.72 * (10 ** 130)); // Body cells count
const arr = [1, 2, 3];
const object = {course: 'JS', part: 1};
const func = function(){};
const nullValue = null;
let undefinedValue;
const boolean = true;

const variables = [string, int, float, bigint, arr, object, func, nullValue, undefinedValue, boolean];

for(const variable of variables){
    console.log(getTypeString(variable));
}

function getTypeString(aVar){
    const result = `${aVar} is ${typeof aVar}`;
    return result;
}