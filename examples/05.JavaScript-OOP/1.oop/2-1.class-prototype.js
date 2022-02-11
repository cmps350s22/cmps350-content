class Circle {
    constructor(r) {
        this.radius = r;
    }
}
const circle = new Circle(3.5);

//Add getArea method to the class at runtime
Circle.prototype.getArea = function () {
    return Math.PI * this.radius * 2;
}

const area = circle.getArea();
console.log(`Circle area: ${area}`);  // 21.9
