const mongoose = require('mongoose')

const projetSchema = mongoose.Schema({
  nomProjet: { type: String, required: true },
  public: { type: Boolean },
  proprio: { type: String, set: toLower },
  users: [{type: String}],
  rows: [{
    id: Number,
    name: { type: String },
    items: [{
      id: Number,
      name: { type: String },
      users: [{ type: String }]
    }],
  }],
  date: { type: Date }
}, {
  versionKey: false
})

function toLower(str) {
  return str.toLowerCase();
}

module.exports = mongoose.model('projet', projetSchema);