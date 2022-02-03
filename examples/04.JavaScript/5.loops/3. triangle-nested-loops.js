function drawTriangle(n) {
	for (let row = 1; row <= n; row++) {
		let rowElements = [];
		for (let column = 1; column <= row; column++) {
			rowElements.push(column);
		}
		console.log(rowElements.join(" "));
	}
}

drawTriangle(5);