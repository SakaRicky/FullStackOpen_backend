require('dotenv').config()
const express = require('express')
const app = express()
let morgan = require('morgan')
let cors = require('cors')
const Contact = require('./models/phonebook')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// morgan.token('body', (req, res) =>   JSON.stringify(req.body));
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// app.use(requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Hello Phonelist!</h1>')
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Contact.count({}).then(persons_number => {
    const date = new Date()
    return response.send(`<div>Phonebook has info for ${persons_number} people</div><br><div>${date}</div>`)
  })

})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(person => response.json(person))
    .catch(error => next(error))
})


app.post('/api/persons/', (request, response, next) => {
  const body = request.body

  const person = new Contact({
    'name': body.name,
    'number': body.number,
  })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    'name': body.name,
    'number': body.number,
  }

  Contact.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {

  Contact.findByIdAndRemove(request.params.id)
    .then(result =>  {
      console.log('removed ', result.name)
      return response.json(result)
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'invalid id' })
  } else if (error.name === 'ValidationError') {
    console.log(error.message)
    return response.status(400).send({ message: error.message })
  }


  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT)
console.log(`Server running on port ${PORT}`)