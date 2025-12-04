const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Order = require('../models/orderModel')


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    req.session.admin = {
      id: admin._id,
      role: admin.role,
      email: admin.email,
      name : admin.name,
    };

    return res.status(200).json({
      message: "Admin Logged In",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });

  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.logout = (req, res) => {
  if (req.session.user || req.session.admin) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid", { path: "/", httpOnly: true, sameSite: "lax" });
      res.json({ message: "Logged Out Successfully" });
    });
  } else {
    res.json({ message: "No active session" });
  }
};



// get all users

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude only password
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot get users" });
  }
};



// Add products

exports.addProducts = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let stock = req.body.stock;
    if (stock) {
      try {
        stock = JSON.parse(stock);
      } catch (err) {
        return res.status(400).json({ message: "Invalid stock format" });
      }
    }
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image: imagePath,
      stock
    });

    await newProduct.save();

    res.json({ message: "Product Added", product: newProduct });
  } catch (error) {
    console.error(error);
    res.json({ message: "Cannot add product" });
  }
}
// get all products

exports.getAllProducts = async (req,res) =>{
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    console.error(error);
    res.json({message:"Cannot Get Products"})
  }
}

// delete a product

exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({ message: "Product not found" });
    }

    const products = await Product.find();
    res.json({ message: "Product Deleted", products });

  } catch (error) {
    console.error(error);
    res.json({ message: "Cannot Delete Product" });
  }
};


exports.deleteProduct = async (req,res)=>{
  try {
    const { productName } = req.body
    await Product.deleteOne({name: productName})
    
    const product = await Product.find()
    res.json({message:"Product Deleted",product})

  } catch (error) {
    console.error(error);
    res.json({message:"Cannot Delete Product"})
  }
}

// Get all Categories

exports.getCategories = async (req,res)=>{
  try {
    const category = await Category.find({},{_id:1,name:1})
    res.json(category)
  } catch (error) {
    console.error(error);
    res.json({message:"Cannot Fetch Categories"})
  }
}

// update a Product 

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let stock = req.body.stock;
    if (stock) {
      try {
        stock = JSON.parse(stock);
      } catch (err) {
        return res.status(400).json({ message: "Invalid stock format" });
      }
    }
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const updateData = { name, description, price, category, stock };

    if (imagePath) {
      updateData.image = imagePath;
    }

    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updateProduct) return res.json({ message: "Product Not Found" });

    res.json({ message: "Product Updated Successfully", product: updateProduct });
  } catch (error) {
    console.error(error);
    res.json({ message: "Error Updating product" });
  }
};

// create Category

exports.addCategory = async(req,res)=>{
  try {
    const {name} = req.body;

    const Exists = await Category.findOne({name: name});
    if(Exists) {
      return res.json({
        success: false,
        message: "Category Already Exists"
      });
    }

    const category = await Category.create({name});
    return res.json({
      success: true,
      message: "Category Created Successfully"
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error Creating Category"
    });
  }
};



// delete a category

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const products = await Product.find({ category: categoryId });
    if (products.length > 0) {
      return res.json({
        success: false,
        message: "Cannot Delete Category, Product Exists"
      });
    }

    const deleteCategory = await Category.findByIdAndDelete(categoryId);
    if (!deleteCategory) {
      return res.json({
        success: false,
        message: "Category not found"
      });
    }

    return res.json({
      success: true,
      message: "Category Deleted Successfully"
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Error Deleting Category"
    });
  }
};


// order update

exports.updateStatus = async(req,res)=>{
  try {
    const orderId = req.params.id
    const {status} = req.body

    const order = await Order.findById(orderId)
    if(!order) return res.json({message:"Order Not Foun"})

      order.status = status
       await order.save()

       res.json({message:"Order Status Updated"})

  } catch (error) {
    console.error(error);
    res.json({message:"Error in Updating Status"})
  }
}

// get orders

exports.getOrders = async (req,res)=>{
  try {
    const orders = await Order.find()
    console.log(orders);
    
    res.json(orders)
  } catch (error) {
    console.error(error);
    res.json({message:"error getting orders"})
  }
}

// Delete order


// Toggle Active / Disabled
exports.toggleActive = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ message: "User status updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
};

// Delete a user
