var Laptop = require('../models/laptop')
var Brand = require('../models/brand')
var Type = require('../models/type')
var { body, validationResult } = require('express-validator')

var async = require('async')

exports.laptopCreateGET = function(req, res, next) {
  async.parallel(
    {
      brands: function(callback) {
        Brand.find(callback)
      },
      types: function(callback) {
        Type.find(callback)
      },
    },
    function(err, result) {
      if (err) return next(err)

      res.render('createLaptop', {
        title: 'New Laptop',
        brands: result.brands,
        types: result.types,
      })
    }
  )
}

exports.laptopCreatePOST = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('brand', 'Brand must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('type', 'Type must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1, max: 150 }),

  body('price', 'Price must not be empty')
    .trim()
    .isNumeric(),

  body('number_in_stock', 'Number must not be empty')
    .trim()
    .isNumeric(),

  body('*').escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    var laptop = new Laptop({
      name: req.body.name,
      brand: req.body.brand,
      type: req.body.type,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    })

    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands: function(callback) {
            Brand.find(callback)
          },
          types: function(callback) {
            Type.find(callback)
          },
        },
        function(err, result) {
          if (err) return next(err)

          res.render('createLaptop', {
            title: 'New Laptop',
            brands: result.brands,
            types: result.types,
            laptop: laptop,
            errors: errors.array(),
          })
        }
      )
      return
    } else {
      laptop.save(function(err) {
        if (err) return next(err)

        res.redirect(laptop.url)
      })
    }
  },
]

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

exports.laptopDeleteGET = function(req, res, next) {
  Laptop.findById(req.params.id)
    .populate('type')
    .populate('brand')
    .exec(function(err, result) {
      if (err) return next(err)
      if (result === null) {
        res.redirect('/laptops')
      }

      res.render('laptopDelete', { title: 'Delete Laptop', laptop: result })
    })
}

exports.laptopDeletePOST = function(req, res, next) {
  Laptop.findByIdAndRemove(req.body.laptopid, function deleteLaptop(err) {
    if (err) return next(err)

    res.redirect('/laptops')
  })
}

exports.laptopUpdateGET = function(req, res, next) {
  async.parallel(
    {
      laptop: function(callback) {
        Laptop.findById(req.params.id)
          .populate('brand')
          .populate('type')
          .exec(callback)
      },
      brands: function(callback) {
        Brand.find(callback)
      },
      types: function(callback) {
        Type.find(callback)
      },
    },
    function(err, result) {
      if (err) return next(err)
      if (result === null) {
        var error = new Error('Not Foung')
        error.status = 404
        next(error)
      }

      res.render('createLaptop', {
        title: 'Update Laptop',
        laptop: result.laptop,
        brands: result.brands,
        types: result.types,
      })
    }
  )
}

exports.laptopUpdatePOST = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 }),
  body('brand', 'Brand must not be empty')
    .trim()
    .isLength({ min: 1 }),
  body('type', 'Type must not be empty')
    .trim()
    .isLength({ min: 1 }),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1, max: 150 }),
  body('price', 'Price must not be empty')
    .trim()
    .isNumeric(),
  body('number_in_stock', 'Number must not be empty')
    .trim()
    .isNumeric(),

  body('*').escape(),

  function(req, res, next) {
    const errors = validationResult(req)

    var laptop = new Laptop({
      name: req.body.name,
      brand: req.body.brand,
      type: req.body.type,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id,
    })

    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands: function(callback) {
            Brand.find(callback)
          },
          types: function(callback) {
            Type.find(callback)
          },
        },
        function(err, result) {
          if (err) return next(err)
          if (result === null) {
            var error = new Error('Not Foung')
            error.status = 404
            next(error)
          }

          res.render('createLaptop', {
            title: 'Update Laptop',
            laptop: laptop,
            brands: result.brands,
            types: result.types,
          })
        }
      )
      return
    } else {
      Laptop.findByIdAndUpdate(req.params.id, laptop, function(err) {
        if (err) return next(err)

        res.redirect(laptop.url)
      })
    }
  },
]
