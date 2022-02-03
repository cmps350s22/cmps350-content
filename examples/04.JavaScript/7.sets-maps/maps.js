//Map associates a key with a value
let numbersMap = new Map();
numbersMap.set(1, "one");
numbersMap.set(2, "two");
numbersMap.set(3, "three");
numbersMap.set(4, "four");

for(let pair of numbersMap) {
    console.log(pair);
}
for(let key of numbersMap.keys()) {
    console.log(key, numbersMap.get(key));
}
for(let value of numbersMap.values()) {
    console.log(value);
}

//Convert a map to a 2D array
let numbersArray = Array.from(numbersMap);
console.log("\nnumbersArray:", numbersArray);