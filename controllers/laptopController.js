var Laptop = require('../models/laptop')
var Brand = require('../models/brand')
var Type = require('../models/type')

var async = require('async')

exports.laptopDetail = function(req, res, next) {
  Laptop.findById(req.params.id)
    .populate('brand')
    .populate('type')
    .exec(function(err, result) {
      if (err) return next(err)
      if (result === null) {
        var error = new Error('Laptop not found')
        error.status = 404
        return next(error)
      }

      res.render('laptopDetail', { title: result.name, data: result })
    })
}

exports.laptopList = function(req, res, next) {
  Laptop.find({}, 'name number_in_stock').exec(function(err, result) {
    if (err) return next(err)

    res.render('laptopList', { title: 'Laptop List', laptopList: result })
  })
}
