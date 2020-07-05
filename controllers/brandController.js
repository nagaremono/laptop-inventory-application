var Laptop = require('../models/laptop')
var Brand = require('../models/brand')
var Type = require('../models/type')
var { body, validationResult } = require('express-validator')

var async = require('async')

exports.brandCreateGet = function(req, res) {
  res.render('createBrand', {
    title: 'New Brand',
  })
}

exports.brandCreatePOST = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1, max: 150 }),

  body('*').escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    var brand = new Brand({
      name: req.body.name,
      description: req.body.description,
    })

    if (!errors.isEmpty()) {
      res.render('createBrand', {
        title: 'New Brand',
        brand: brand,
        errors: errors.array(),
      })
      return
    } else {
      brand.save(function(err) {
        if (err) return next(err)

        res.redirect(brand.url)
      })
    }
  },
]

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
