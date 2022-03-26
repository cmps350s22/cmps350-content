/*
Promise.race
What is this? The first fulfilled promise or reject the whole promise when even one promise rejects.
Idiom - A race between Good 😇 (Fulfilled) and Evil 😈 (Rejected)
Not really an idiom though 😅
Characteristic - Short-circuits when an input value is settled
 */
const promiseWillFulfill = [
    new Promise((resolve, reject) => setTimeout(reject, 250, '😈')),
    new Promise((resolve, reject) => setTimeout(resolve, 150, '😇')),
    new Promise((resolve, reject) => setTimeout(resolve, 1, '😇')),
]
Promise.race(promiseWillFulfill)
    .then(value => console.log(`The humanity survives "${value}"`))
    .catch(error => console.log(`Won't be called as 😇 will win the race`))



const promiseWillReject = [
    new Promise((resolve, reject) => setTimeout(resolve, 250, '😇')),
    new Promise((resolve, reject) => setTimeout(reject, 1, '😈')),
    new Promise((resolve, reject) => setTimeout(resolve, 250, '😇')),
]
Promise.race(promiseWillReject)
    .then(value => console.log(`This won't be called...="${value}"`))
    .catch(error => console.log(`The humanity is doomed...="${error}"`))


const promisesWithOUTReject = [
    new Promise(resolve => setTimeout(resolve, 350, 'one')),
    new Promise(resolve => setTimeout(resolve, 250, 'two')),
    new Promise(resolve => setTimeout(resolve, 150, 'three')),
]
Promise.race(promisesWithOUTReject)
    .then(value => console.log(`Promise without reject="${value}"`))