#! /usr/bin/env node

console.log(
  'This script populates some test laptops, brand, and type to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true'
)

// Get arguments passed on command line
var userArgs = process.argv.slice(2)
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Laptop = require('./models/laptop')
var Brand = require('./models/brand')
var Type = require('./models/type')

var mongoose = require('mongoose')
var mongoDB = userArgs[0]
mongoose.connect(mongoDB, { useNewUrlParser: true })
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

var laptops = []
var brands = []
var types = []

function laptopCreate(
  name,
  brand,
  type,
  description,
  price,
  number_in_stock,
  cb
) {
  var laptopdetail = {
    name: name,
    brand: brand,
    type: type,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
  }

  var laptop = new Laptop(laptopdetail)

  laptop.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Laptop: ' + laptop)
    laptops.push(laptop)
    cb(null, laptop)
  })
}

function brandCreate(name, description, cb) {
  var brand = new Brand({ name: name, description: description })

  brand.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Brand: ' + brand)
    brands.push(brand)
    cb(null, brand)
  })
}

function typeCreate(name, description, cb) {
  var type = new Type({ name: name, description: description })
  type.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Type: ' + type)
    types.push(type)
    cb(null, type)
  })
}

function createTypeAndBrand(cb) {
  async.series(
    [
      function(callback) {
        typeCreate(
          'Thin and Light',
          'Laptops with slim design that boasts portability, battery life, and good looks',
          callback
        )
      },
      function(callback) {
        typeCreate(
          'Gaming',
          'Laptops with powerful components to game on the go',
          callback
        )
      },
      function(callback) {
        typeCreate(
          '2 in 1',
          'Laptops that works as a traditional laptop and a tablet',
          callback
        )
      },
      function(callback) {
        brandCreate(
          'Asus',
          'AsusTek Computer Inc. is a Taiwan-based multinational computer and phone hardware and electronics company headquartered in Beitou District, Taipei, Taiwan.',
          callback
        )
      },
      function(callback) {
        brandCreate(
          'Dell',
          'Dell Inc. is an American multinational computer technology company that develops, sells, repairs, and supports computers and related products.',
          callback
        )
      },
      function(callback) {
        brandCreate(
          'Razer',
          'Razer Inc. is a global gaming hardware manufacturing company, as well as an esports and financial services provider established in 2005 in San Diego.',
          callback
        )
      },
    ],
    // optional callback
    cb
  )
}

function createLaptops(cb) {
  async.parallel(
    [
      function(callback) {
        laptopCreate(
          'Asus Zenbook 14',
          brands[0],
          types[0],
          'A reasonably priced, premium thin and light laptop with good build quality',
          900,
          10,
          callback
        )
      },
      function(callback) {
        laptopCreate(
          'Dell XPS 13',
          brands[1],
          types[0],
          'Premium thin and light laptop with very slim bezels',
          1100,
          10,
          callback
        )
      },
      function(callback) {
        laptopCreate(
          'Razer Blade 15',
          brands[2],
          types[2],
          'A powerful thin and light gaming laptop with sleek and minimal design',
          1600,
          15,
          callback
        )
      },
      function(callback) {
        laptopCreate(
          'Asus Zenbook Flip 14',
          brands[0],
          types[2],
          'A comfortable 2 in 1 device with good build quality',
          1000,
          20,
          callback
        )
      },
      function(callback) {
        laptopCreate(
          'Razer Blade Stealth',
          brands[2],
          types[0],
          'A more portable version of the razer blade with clean design',
          1700,
          5,
          callback
        )
      },
      function(callback) {
        laptopCreate(
          'Dell G7',
          brands[1],
          types[1],
          'A robust built gaming laptop with powerful hardware and clean look',
          1400,
          20,
          callback
        )
      },
    ],
    // optional callback
    cb
  )
}

async.series(
  [createTypeAndBrand, createLaptops],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err)
    } else {
      console.log('Laptops ' + laptops)
    }
    // All done, disconnect from database
    mongoose.connection.close()
  }
)
