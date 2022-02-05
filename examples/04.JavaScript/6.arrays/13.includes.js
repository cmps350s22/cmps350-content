/* The includes() method determines whether an array includes a certain value among its entries,
 returning true or false as appropriate
*/
const fruits = ['🍐', '🥑', '🍇']
console.log( fruits.includes('🥑') )      // true
console.log( fruits.includes('🍉') )      // false

/* If fromIndex is greater than or equal to the length of the array,
false is returned. The array won’t be searched.
*/
console.log( fruits.includes('🍇', 3) )   // false

