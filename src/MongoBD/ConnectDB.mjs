import mongoose from "mongoose";

mongoose.connect('mongodb+srv://kyanh0708:kyanh0708@cluster0.thzyokf.mongodb.net/test' , (err) => {
    if(err){
        console.log(err)
    }else{
        console.log("success")
    }
});

export default mongoose