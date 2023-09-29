const counterObj = require('./myscript.js');

console.log(counterObj.getCounter());
counterObj.incrementCounter();
console.log(counterObj.getCounter());

const newCounterObj = require('./myscript.js');
console.log(newCounterObj.getCounter());