const mongoose = require('mongoose')


const url = process.env.MONGODB_URI

console.log('url is: ', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('Conected to MongoDB')
  })
  .catch(error => {
    console.log('error: ', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

module.exports = mongoose.model('Contact', contactSchema)