import mongoose from "./ConnectDB.mjs"

const Schema = mongoose.Schema

const CategorySchema = new Schema({
    category : {
        url_category : { type : String },
        title : { type : String },
        category_sub : [
            {
                title : { type : String },
                url_category_sub : { type : String },
                quantity : { type : Number }
            }
        ]
    }
    
})

export const Category = mongoose.model('Category' , CategorySchema);

