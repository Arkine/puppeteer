const express = require('express');

const app = new express();

app.use(express.static('./html'));

const listener = app.listen(8080);

console.log('App listening on port', listener.address().port);