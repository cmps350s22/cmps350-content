function factorial(n){
	if(n==1){
		return 1;
	}

	return factorial(n-1) * n;	
}

console.log("factorial(5) = ", factorial(5));
console.log("factorial(12) = ", factorial(12));