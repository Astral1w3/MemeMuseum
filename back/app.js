const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Ciao, il server è funzionante!');
});

module.exports = app;