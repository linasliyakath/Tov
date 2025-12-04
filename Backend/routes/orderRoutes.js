const express = require('express')
const router = express.Router()

const {createOrder, getOrders, getOrderById , cancelOrder} = require('../controllers/orderController')
const {isAutheticated, isadmin} = require('../middleware/authMiddleware')

router.post('/placeOrder',isAutheticated,createOrder)
router.get('/getOrders',isAutheticated,getOrders)
router.get('/getOrderById/:id',isAutheticated,getOrderById)
router.delete('/cancelOrder/:id',isAutheticated,cancelOrder)




module.exports = router