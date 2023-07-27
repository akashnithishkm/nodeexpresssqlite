// default imports

// const name = require('./commonexport.js');
// console.log(name);

// named imports

const {firstName, lastName} = require('./commonexport.js');
console.log(`My name is ${firstName} ${lastName}`);