import mongoose from "mongoose";

const Schema = mongoose.Schema

const PaySchema = new  Schema({
    user : {
        id_user : { type : String },
        name_receive : { type : String },
        phone : { type : String },
        address_receive : { type : String }
    },
    product : {
        id_product: { type : Schema.Types.ObjectId , ref : "Product" },
        size : { type : String },
        quantity : { type : Number },
        date : { type : Date },
    },
    status_product : 
        {
            title : { type : String },
            status : { type : Boolean }
        }
})

export const Pay = mongoose.model("Pay" , PaySchema)

