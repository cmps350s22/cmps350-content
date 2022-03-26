/*Promise.allSettled
What is this? all promises regardless of settled (fulfilled/rejected) status.
    Idiom - Let's "wait and see" 🤔.
Characteristic - Does not short-circuit unlike Promise.all/race*/

const allRejectedPromises = [
    Promise.reject('🍏 #1'),
    Promise.reject('🍏 #2'),
    Promise.reject('🍏 #3'),
]

Promise.allSettled(allRejectedPromises)
    .then(badApples =>
        console.log(`We can't sell any of these apples...`, badApples))
    .catch(error => console.error('This should never occur'))


const promisesWithoutReject = [
    Promise.resolve('🍎 #1'),
    '🍎 #2',
    new Promise((resolve, reject) => setTimeout(resolve, 100, '🍎 #3'))
]

Promise.allSettled(promisesWithoutReject)
    .then(apples => console.log(`We can sell all these good apples`, apples.map(_=>_.value)))


const promisesWithOneReject = [
    Promise.resolve('🍎 #1'),
    new Promise((_, reject) => setTimeout(reject, 10, '🍏 #2')),
    '🍎 #3',
    new Promise((_, reject) => setTimeout(reject, 100, '🍏 #4'))
]

Promise.allSettled(promisesWithOneReject)
    .then(apples => {
        const badApples = apples.filter(apple => apple.status === 'rejected').map(_ => _.reason)
        const goodApples = apples.filter(apple => apple.status === 'fulfilled').map(_ => _.value)

        console.log(`Let's throw out`, badApples, `and sell the rest`, goodApples)
    })