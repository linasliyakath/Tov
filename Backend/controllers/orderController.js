const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');


// Create order and reduce stock
exports.createOrder = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { name, address, phone } = req.body;

    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Validate size presence
    for (const item of cart.items) {
      if (!item.size) {
        return res.status(400).json({ message: "Size is required for all items in order." });
      }
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      if (!item.productId) return sum;
      return sum + item.productId.price * item.quantity;
    }, 0);

    // Check stock availability again before creating order
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      const stockQty = product.stock.get(item.size) || 0;
      if (stockQty < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name} size ${item.size}` });
      }
    }

    const newOrder = new Order({
      user: userId,
      email: findUser.email,
      items: cart.items.filter(item => item.productId).map(item => ({
        product: item.productId._id,
        quantity: item.quantity,
        name: item.name,
        size: item.size
      })),
      shippingInfo: { name, address, phone },
      totalAmount
    });

    await newOrder.save();

    // Reduce stock per item
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (product) {
        const currentStock = product.stock.get(item.size) || 0;
        product.stock.set(item.size, currentStock - item.quantity);
        await product.save();
      }
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Cannot create order" });
  }
};



// get orders
exports.getOrders = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const orders = await Order.find({ user: userId }).populate({
      path : "items.product",
      select:"name image"
    })
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error); //  
    res.status(500).json({ message: 'Cannot Fetch Orders' });
  }
};

exports.getOrderById = async(req,res)=>{
    try {
        const userId = req.session.user.id
        const order = await Order.findOne({_id:req.params.id, user: userId}).populate('items.product')

        if(!order) return res.json({message:"Order NOt Found"})

            res.json(order)

    } catch (error) {
        console.error(error);
        res.json({message:"Error Fetching Orders BY "})
        
    }
}

exports.cancelOrder = async (req,res)=>{
  try {
    const orderId = req.params.id

    const orderExists = await Order.find({_id:orderId})
    if(!orderExists) return res.json({message:"Order Id dosent exist"})

    await Order.deleteOne({_id:orderId})
    res.json({message:"Order Deleted"})
  } catch (error) {
    console.error(error);
    res.json({message:"Error deleting Orders"})
  }
}
