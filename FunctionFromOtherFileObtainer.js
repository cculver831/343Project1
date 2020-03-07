const fs = require('fs');
const path = require('path');
//Example from Steven Centeno (can delete since its just an example)

//this returns the array from my file
let ArrayDirectories = require('./ReadFiles')('C:\\Users\\steve\\Documents\\GitHub\\343Project1\\MyApp');
console.log(ArrayDirectories.latestManiFile);