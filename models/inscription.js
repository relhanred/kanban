const mongoose = require('mongoose')

const inscriptionSchema = mongoose.Schema({
  nom: {type: String, set: toLower, required: true},
  email: {type: String, set: toLower, required: true},
  password: {type: String, required: true},
  passwordBis: {type: String, required: true},
  date: {type: Date,default: Date.now},
},{
  versionKey:false
})

function toLower (str) {
  return str.toLowerCase();
}

module.exports = mongoose.model('Utilisateurs', inscriptionSchema);


