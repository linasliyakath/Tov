const express = require('express')
const router = express.Router()

const {register, login, logout, checkAuth} = require('../controllers/authController')

router.get('/',(req,res)=>{res.send({message:"Ecommerce-Backend"})})
router.get('/login',(req,res)=>{res.send({message:"Login Page"})})
router.get('/register',(req,res)=>{res.send({message:"Register Page"})})



router.post('/register',register)
router.post('/login',login)
router.delete('/logout',logout)
router.get('/checkAuth',checkAuth)

module.exports = router