import mongoose from "./ConnectDB.mjs"

const Schema = mongoose.Schema

const FeedBackSchema = new Schema({
    _id : { type : mongoose.Types.ObjectId },
    content_feedback : [{
        id_user : { type : String },
        username : { type : String },
        avatar : { type : String },
        content : { type : String },
        date : { type : String },
        time : { type : String },
        like : { type : Number },
        _id : { type : mongoose.Types.ObjectId }
    }],
})
export const FeedBack = mongoose.model("Feedback" , FeedBackSchema)