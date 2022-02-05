const sentence = "Sample sentence to show string methods";

console.log(sentence);
console.log(`length = ${sentence.length}`);

console.log(`sentence[5] = ${sentence[5]}`);
console.log(`sentence.charAt(5) = ${sentence.charAt(5)}`);

console.log(`'${sentence}'.indexOf('string') = ${sentence.indexOf("string")}`);
console.log(`'${sentence}'.indexOf('string',8) = ${sentence.indexOf("string", 8)}`);
console.log(`'${sentence}'.indexOf('string',40) = ${sentence.indexOf("string", 40)}`);

//The substring() method extracts the characters from a string, between two specified indices, and returns the new sub string.
console.log(`'${sentence}'.substring(6,7) = '${sentence.substring(7, 15)}'`);

const str = "                  There is elegance in simplicity                ";

console.log("trimming whitespace");
console.log(`original: ! ${str} !`);

console.log(`trim: !${str.trim()}!`);
console.log(`trimLeft: !${str.trimLeft()}!`);
console.log(`trimRight: !${str.trimRight()}!`);