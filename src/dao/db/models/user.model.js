// Crear un modelo User el cual contará con los campos:
// first_name:String,
// last_name:String,
// email:String (único)
// age:Number,
// password:String(Hash)
// cart:Id con referencia a Carts
// role:String(default:’user’)

import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
    },
    role: {
        type: String,
        default: "usuario"
    }
});

export const userModel = mongoose.model(userCollection, userSchema);