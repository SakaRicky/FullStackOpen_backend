const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://rickysaka:${password}@cluster0.u3l97.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: Date,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: 'Nguiemou Lucienne',
  number: +24112345678,
})

// Note.find({}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })

contact.save().then(result => {
  console.log('note saved! as:', result)
  mongoose.connection.close()
})