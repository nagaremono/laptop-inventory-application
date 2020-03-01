var mongoose = require('mongoose')

var Schema = mongoose.Schema

var typeSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 150 },
})

typeSchema.virtual('url').get(function() {
  return '/type/' + this._id
})

module.exports = mongoose.model('Type', typeSchema)
