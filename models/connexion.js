const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const connexionSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  date: {type: Date,default: Date.now}, 
},{
  versionKey:false
})

connexionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('utilisateurs', connexionSchema);