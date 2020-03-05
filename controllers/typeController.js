var Laptop = require('../models/laptop')
var Brand = require('../models/brand')
var Type = require('../models/type')

var async = require('async')

exports.typeDetail = function(req, res, next) {
  async.parallel(
    {
      type: function(callback) {
        Type.findById(req.params.id, callback)
      },
      typeLaptops: function(callback) {
        Laptop.find({ type: req.params.id }, callback)
      },
    },
    function(err, result) {
      if (err) return next(err)
      if (result === null) {
        var error = new Error('Type not found')
        error.status = 404
        return next(error)
      }

      res.render('typeDetail', {
        title: result.type.name,
        type: result.type,
        typeLaptops: result.typeLaptops,
      })
    }
  )
}

exports.typeList = function(req, res, next) {
  Type.find({}, 'name', function(err, result) {
    if (err) return next(err)

    res.render('typeList', { title: 'Type List', typeList: result })
  })
}
