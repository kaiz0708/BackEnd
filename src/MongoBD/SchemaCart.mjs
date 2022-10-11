import mongoose from "./ConnectDB.mjs";

const Schema = mongoose.Schema;

const CartSchema = new Schema({
    _id : { type : mongoose.Types.ObjectId },
    id_user : { type : String },
    product : {type : Schema.Types.ObjectId , ref : "Product"},
    quantity : { type : Number },
    size : { type : String }
})

export const Cart = mongoose.model("Cart" , CartSchema)