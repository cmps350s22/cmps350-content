class Polygon {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }

    get area() {
        return this.calcArea();
    }

    calcArea() {
        return this.height * this.width;
    }
}

const polygon = new Polygon(30, 20);
console.log('polygon.area : ', polygon.area);
console.log('polygon.calcArea() : ', polygon.calcArea());