const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  email:{type:String,required:true},
  items: [
    {
      product: {type: mongoose.Schema.Types.ObjectId,ref: 'Product',required: true},
      quantity: {type: Number,required: true},
      name:{type :String},
      size: { type: String, required: true }
    }
  ],
    shippingInfo: {name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
  },
  totalAmount: {type: Number,required: true},
  status: {type: String,default: 'Pending'}
});


module.exports = mongoose.model('Order',orderSchema)
