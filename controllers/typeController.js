var Laptop = require('../models/laptop')
var Brand = require('../models/brand')
var Type = require('../models/type')
var { body, validationResult } = require('express-validator')

var async = require('async')

exports.typeCreateGet = function(req, res) {
  res.render('createType', {
    title: 'New Type',
  })
}

exports.typeCreatePOST = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1, max: 150 }),

  body('*').escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    var type = new Type({
      name: req.body.name,
      description: req.body.description,
    })

    if (!errors.isEmpty()) {
      res.render('createType', {
        title: 'New Type',
        type: type,
        errors: errors.array(),
      })
      return
    } else {
      type.save(function(err) {
        if (err) return next(err)

        res.redirect(type.url)
      })
    }
  },
]

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
