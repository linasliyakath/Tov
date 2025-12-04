const express = require('express')
const router = express.Router()

const {addToCart, getCart, updateCartItems, removeItems} = require('../controllers/cartController')
const {isAutheticated} = require('../middleware/authMiddleware')


router.post('/add',isAutheticated,addToCart)
router.get('/getCart',isAutheticated,getCart)
router.put('/updateCart',isAutheticated,updateCartItems)
router.delete('/remove',removeItems)

module.exports = router