var Laptop = require('../models/laptop')
var Brand = require('../models/brand')
var Type = require('../models/type')

var async = require('async')

exports.brandDetail = function(req, res, next) {
  async.parallel(
    {
      brand: function(callback) {
        Brand.findById(req.params.id).exec(callback)
      },
      brandLaptops: function(callback) {
        Laptop.find({ brand: req.params.id }).exec(callback)
      },
    },
    function(err, result) {
      if (err) return next(err)
      if (result === null) {
        var error = new Error('Not found')
        error.status = 404
        return next(error)
      }

      res.render('brandDetail', {
        title: result.name,
        brand: result.brand,
        brandLaptops: result.brandLaptops,
      })
    }
  )
}

exports.brandList = function(req, res, next) {
  Brand.find({}, 'name', function(err, result) {
    if (err) return next(err)

    res.render('brandList', { title: 'Brand List', brandList: result })
  })
}
