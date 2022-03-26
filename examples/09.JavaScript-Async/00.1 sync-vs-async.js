const tick = Date.now();
const log = (v) => console.log(`${v} \n Elapsed: ${Date.now() - tick}ms`);

function avg() {
    let sum=0, count = 900_000_0000;
    for(let i=1; i<= count; i++) {
        sum += i;
    }
    return sum/count;
}

function avgAsync() {
    return Promise.resolve().then(() => {
        let sum = 0, count = 900_000_0000;
        for (let i = 1; i <= count; i++) {
            sum += i;
        }
        return sum/count;
    });
}

log('- Synchronous 1');
//log( `- avg ${avg()}`);
avgAsync().then(log);
log('- Synchronous 2');
log('- Synchronous 3');
log('- Synchronous 4');