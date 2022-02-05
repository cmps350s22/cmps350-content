const a = true;
const b = false;

console.log("a && b = " + (a && b)); // false
console.log("a || b = " + (a || b)); // true
console.log("a ^ b = " + (a ^ b)); // 1	  !!!!!! ^ is XOR
console.log("!b = " + (!b)); // True
console.log("b || true = " + (b || true)); // True
console.log("b && true = " + (b && true)); // False
console.log("a || true = " + (a || true)); // True
console.log("a && true = " + (a && true)); // True
console.log("!a = " + (!a)); // False
console.log("(5 > 7) ^ (a == b) = " + ((5 > 7) ^ (a == b))); // 0