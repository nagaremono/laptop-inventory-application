var Laptop = require('../models/laptop')
var Brand = require('../models/brand')
var Type = require('../models/type')

var async = require('async')

exports.home = function(req, res, next) {
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
      res.render('home', { data: results, err: err })
    }
  )
}
