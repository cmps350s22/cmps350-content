import {sum, multiply} from './app1-lib.js';
import userIdGenerator from './app1-lib.js'
import path from 'path';
import fs from 'fs';
import os from 'os';

console.log('Result of add(2, 3, 5) : ', sum(2, 3, 5));
console.log('Result of multiply(2, 3, 5) : ', multiply(2, 3, 5));
console.log('UserId 1: ', userIdGenerator.next());
console.log('UserId 2: ', userIdGenerator.next());

const currentPath = path.resolve();
console.log(`Files in current path: ${currentPath}`);
fs.readdir(currentPath, (err, files) => {
    files.forEach(file => {
        console.log(file);
    })
})

// array of information about each cpu core
//console.log(os.cpus())

// total memory, free memory, in Gigabyte:
console.log("Total memory (GB): ", os.totalmem() / 1024 ** 3)
console.log("Free memory (GB): ",os.freemem() / 1024 ** 3)

console.log("Uptime in hours: ",os.uptime() / 60 ** 2)