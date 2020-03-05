var mongoose = require('mongoose')

var Schema = mongoose.Schema

var laptopSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  type: { type: Schema.Types.ObjectId, ref: 'Type', required: true },
  description: { type: String, required: true, max: 150 },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
})

laptopSchema.virtual('url').get(function() {
  return '/laptop/' + this._id
})

laptopSchema.virtual('formatted_price').get(function() {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return formatter.format(this.price)
})

module.exports = mongoose.model('Laptop', laptopSchema)
