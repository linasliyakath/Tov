const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

// Get Cart Items
exports.getCart = async (req,res)=>{
    try {
       const userId = req.session.user.id
       
       if(!userId){
        return res.status(404).json({message : "User not Logged in"})
       }
       const cartItems = await Cart.findOne({userId}).populate('items.productId')
       res.json(cartItems)

    } catch (error) {
     res.json({message:"cannot get cart"})
    }
}

// add items to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { productId, quantity, name, size } = req.body;

    if (!size) {
      return res.status(400).json({ message: "Size is required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const availableStock = product.stock.get(size) || 0;
    if (quantity > availableStock) {
      return res.status(400).json({ message: `Only ${availableStock} items available in size ${size}` });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity, name, size }] });
    } else {
      const item = cart.items.find(i => i.productId.toString() === productId && i.size === size);

      if (item) {
        if (item.quantity + quantity > availableStock) {
          return res.status(400).json({ message: `Cannot add ${quantity} items. Only ${availableStock - item.quantity} more available in size ${size}` });
        }
        item.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, name, size });
      }
    }

    await cart.save();
    console.log(cart)
    res.json({ message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Cart Items
exports.updateCartItems = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { productId, size, quantity } = req.body;

    if (!size) {
      return res.status(400).json({ message: "Size is required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const availableStock = product.stock.get(size) || 0;
    if (quantity > availableStock) {
      return res.status(400).json({ message: `Only ${availableStock} items available in size ${size}` });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ message: "Cart Error" });

    const item = cart.items.find(i => i.productId.toString() === productId && i.size === size);
    if (!item) return res.json({ message: "Item not found in Cart" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Quantity updated", cart });
  } catch (error) {
    res.json({ message: "Error Updating Quantity", error });
  }
};

// remove items from cart 
exports.removeItems = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { productId, size } = req.body;

    if (!size) {
      return res.status(400).json({ message: "Size is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      i => !(i.productId.toString() === productId && i.size === size)
    );
    await cart.save();

    res.json({ message: "Item removed" });
  } catch (error) {
    res.json({ message: "Cart removing error" });
  }
};


