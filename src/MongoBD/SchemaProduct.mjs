import mongoose from "./ConnectDB.mjs";

const Schema = mongoose.Schema

const ProductSchema = new Schema({
    common : {
        pic : { type : String },
        brand : {type : String},
        title : { type : String },
        cost :  { type : Number },
        discount : { type : Number }
    },

    cate : {
        category : { type : String },
        category_sub : { type : String },
        type : { type : String },
    },

    link : {
        url_category : { type : String },
        url_category_sub : { type : String }
    },

    about : {
        pic_color : {type : String} ,
        size : [
        {
            size_name : {type : String} ,
            quantity : {type : Number}
        }]
    },

    describe: {
        material : {
            title : { type : String },
            content : { type : String }
        },

        form : {
            title : { type : String },
            content : { type : String }
        },

        fit : {
            title : { type : String },
            content : { type : String }
        }
    },

    feedback : { type : mongoose.Types.ObjectId , ref : "Feedback" }
})

export const Product = mongoose.model("Product" , ProductSchema);