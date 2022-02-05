const universeAge = 14_000_000_000
console.log(`typeof universeAge: ${typeof universeAge}`)
console.log(`Universe Age: ${universeAge}`)
console.log(`Max Int: ${Number.MAX_SAFE_INTEGER}`)

console.log('-'.repeat(20))

// BigInt could be used for performing mathematical operations on large integers
const bingInt = BigInt(Number.MAX_SAFE_INTEGER ** 15)
console.log(`Max Int power 15: ${bingInt}`)

console.log('-'.repeat(20))
// 37.2 trillion cells in the human body
const countBodyCells = BigInt(3.72 * (10 ** 130))
console.log(`typeof countBodyCells: ${typeof countBodyCells}`)
console.log(`Body cells count: ${countBodyCells}`)