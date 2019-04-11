'use strict';

const Tester = require ('./lib/application.js');

const testA = require('./middleware/testA');
const testB = require('./middleware/testB');


const app = new Tester();

// app.use(testA);
// app.use(testB);

app.all([
    testA,
    testB
]);

app.start();

