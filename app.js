let notes = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    },
]

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json())
app.get('/api/persons', (req, res) => {
    res.json(notes)
})

module.exports = app;
