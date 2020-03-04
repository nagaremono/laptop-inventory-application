var Laptop = require('../models/laptop')
var Brand = require('../models/brand')
var Type = require('../models/type')

var async = require('async')

exports.home = function(req, res) {
  async.parallel(
    {
      laptop: function(callback) {
        Laptop.countDocuments({}, callback)
      },
      brand: function(callback) {
        Brand.countDocuments({}, callback)
      },
      type: function(callback) {
        Type.countDocuments({}, callback)
      },
    },
    function(err, results) {
      res.render('home', {
        title: 'Laptop Inventory',
        data: results,
        error: err,
      })
    }
  )
}
