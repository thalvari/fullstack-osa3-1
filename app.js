require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express();
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('content', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({error: 'name or number missing'})
    }
    // if (persons.find(person => person.name === body.name)) {
    //     return res.status(400).json({error: 'name must be unique'})
    // }
    const person = new Person({
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1e6) + 1,
    })
    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = app;
