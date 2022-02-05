//Map associates a key with a value
const numbersMap = new Map();
numbersMap.set(1, "one");
numbersMap.set(2, "two");
numbersMap.set(3, "three");
numbersMap.set(4, "four");

for(const pair of numbersMap) {
    console.log(pair);
}
for(const key of numbersMap.keys()) {
    console.log(key, numbersMap[key]);
}
for(const value of numbersMap.values()) {
    console.log(value);
}

//Convert a map to a 2D array
const numbersArray = Array.from(numbersMap);
console.log("\nnumbersArray:", numbersArray);