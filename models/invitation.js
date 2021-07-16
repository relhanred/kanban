const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({
  idProjet: {type: String},
  nomProjet: {type: String, required: true},
  proprio: {type: String, required: true},
  guests: [{type: String}]
},{
  versionKey:false
})


module.exports = mongoose.model('invitation', invitationSchema);