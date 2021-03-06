/* The includes() method determines whether an array includes a certain value among its entries,
 returning true or false as appropriate
*/
const fruits = ['π', 'π₯', 'π']
console.log( fruits.includes('π₯') )      // true
console.log( fruits.includes('π') )      // false

/* If fromIndex is greater than or equal to the length of the array,
false is returned. The array wonβt be searched.
*/
console.log( fruits.includes('π', 3) )   // false

