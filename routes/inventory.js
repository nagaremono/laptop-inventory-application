var express = require('express')
var router = express.Router()

// Controller modules
var homeController = require('./controllers/homeController')
var laptopController = require('./controllers/laptopController')
var brandController = require('./controllers/brandController')
var typeController = require('./controllers/typeController')

router.get('/home', homeController.home)

// Laptop controllers
router.get('/laptop/:id/', laptopController.laptopDetail)
router.get('/laptops', laptopController.laptopList)

// Brand Controllers
router.get('/brand/:id', brandController.brandDetail)
router.get('/brands', brandController.brandList)

// Type Controllers
router.get('/type/:id', typeController.typeDetail)
router.get('/types', typeController.typeList)

module.exports = router
