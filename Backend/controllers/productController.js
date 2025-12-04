const Product = require('../models/productModel')
const Categories = require('../models/categoryModel')



// get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products); 
  } catch (error) {
    res.json({ message: "Error Fetching Products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.json({ message: "Product Not Found!" });
    res.json(product); // includes sizes
  } catch (error) {
    console.log("Fetching By Id error", error);
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Product.find({ category: categoryId });
    res.status(200).json(products); 
  } catch (error) {
    console.log(error, "Error fetching Category");
    res.status(500).json({ message: "Server Error while fetching Products" });
  }
};


// Get products by ID

exports.getProductById = async (req,res) =>{
    try {
        const product = await Product.findById(req.params.id)
         if(!product) return res.json({message:"Product Not Found!"})
            res.json(product)
    } catch (error) {
        console.log('Fetching By Id error',error)        
    }
}


exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const getProductsByCategory = await Product.find({ category: categoryId });
    res.status(200).json(getProductsByCategory);
  } catch (error) {
    console.log(error, "Error fetching Category");
    res.status(500).json({ message: "Server Error while fetching Products" });
  }
}


// get categories 
exports.getCategories = async (req,res)=>{
    try {
        const category = await Categories.find()
        res.json(category)
    } catch (error) {
        console.log(error);
        
        res.json({message:"Error Getting Categories"})
    }
}

exports.getCategoryById = async (req,res) =>{
  try {
    const category = await Categories.findById(req.params.id)
    if(!category) return res.status(404).json({message:"Category Not Found"});
    res.json(category)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Error Getting Category By id"})
  }
}

// controllers/productController.js
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    }).limit(5);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
};

