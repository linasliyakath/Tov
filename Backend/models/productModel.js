const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String },
  sizes: {
    type: [String],
    required: true,
    default: ['S', 'M', 'L', 'XL', 'XXL']
  },
  stock: {
    type: Map,
    of: Number,
    required: true,
    default: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
  }
})


module.exports = mongoose.model('Product',productSchema)