// avoid using var
function divide(x, y) {
    if (y != 0) {
        var result = x / y;
    }
    return result;
}

//console.log(result); //will throw variable not defined error
console.log(divide(10, 5));

/*
    var is function-scoped
*/