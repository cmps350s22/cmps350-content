import calculator from "./calculator.js";

//When the document is loaded in the browser then listen to btnCompute click event
document.addEventListener("DOMContentLoaded", () => {
    console.log("js-DOM fully loaded and parsed");
    document.querySelector('#btnCompute').addEventListener("click", handleCompute);
});

// Make handleCompute accessible from Html
window.handleCompute = handleCompute;

function handleCompute() {
    const num1 = parseInt( document.querySelector("#num1").value );
    const num2 = parseInt( document.querySelector("#num2").value );
    const operation = document.querySelector("#operation").value;
    const resultDiv = document.querySelector("#result");

    const result = calculator.compute(num1, num2, operation);

    resultDiv.innerHTML = `${num1}  ${operation}  ${num2}  = ${result}`;
    console.log(result);
}