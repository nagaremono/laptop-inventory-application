var mongoose = require('mongoose')

var Schema = mongoose.Schema

var brandSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 150 },
})

brandSchema.virtual('url').get(function() {
  return '/brand/' + this._id
})

module.exports = mongoose.model('Brand', brandSchema)
