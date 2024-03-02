import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true
    }
})

export default Product;