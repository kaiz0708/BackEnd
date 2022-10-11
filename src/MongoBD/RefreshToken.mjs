import mongoose from "./ConnectDB.mjs";

const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
    refreshtoken : {type : String},
    id_user : {type : String}
})

export const RefreshToken = mongoose.model('Refreshtoken', RefreshTokenSchema)