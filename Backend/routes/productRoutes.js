const express = require('express')
const router = express.Router()

const multer = require('multer')
const path = require('path')
const {getAllProducts, getProductById, getCategories, getProductsByCategory, getCategoryById, searchProducts} = require('../controllers/productController')
const {isadmin, isAutheticated} = require('../middleware/authMiddleware')


    
    router.get('/getAllProducts',getAllProducts)
    router.get('/getProductById/:id',getProductById)
    router.get('/getCategories',getCategories)
    router.get("/productsByCategory/:id", getProductsByCategory);   
    router.get('/getCategoryById/:id',getCategoryById);
    router.get('/search',searchProducts)
    
    module.exports = router


