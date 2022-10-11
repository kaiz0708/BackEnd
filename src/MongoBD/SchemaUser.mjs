import mongoose from "./ConnectDB.mjs";

const Schema = mongoose.Schema

const UserSchema = new Schema({
    _id : { type : mongoose.Types.ObjectId },
    
    infor_user : {
        username : { type : String },
        name : { type : String },
        date_of_birth : { type : String },
        phone : { type : String },
        address : { type : String }, 
        pic : { type : String } 
    },

    infor_account : {
        account : { type : String },
        pass : { type : String },
        type : { type : String }
    },
})

export const User = mongoose.model('User' , UserSchema)
