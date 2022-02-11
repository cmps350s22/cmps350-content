Array.prototype.getMax = function() {
    const max = Math.max(...this);
    return max;
}

//adding a method to arrays to sum their number elements
Array.prototype.sum = function() {
    const sum = this.reduce((prev, curr) => prev + curr)
    return sum;
}

const numbers = [9, 1, 11, 3, 4];
console.log(`[${numbers.join(', ')}].getMax() = ${numbers.getMax()}`);
console.log(`[${numbers.join(', ')}].sum() = ${numbers.sum()}`);