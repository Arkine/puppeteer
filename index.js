'use strict';

const Tester = require ('./lib/application.js');

const testA = require('./middleware/testA');
const testB = require('./middleware/testB');

const config = require('./config');


const app = new Tester();

// Set the context configuration
app.setContext(config);

// app.use(testA);
// app.use(testB);

app.all([
    testA,
    testB
]);

app.start();

