import { Product } from '../../MongoBD/SchemaProduct.mjs'
import { Category } from "../../MongoBD/SchemaCategory.mjs"
import { FeedBack } from '../../MongoBD/SchemaFeedback.mjs'
import { ObjectId } from 'mongodb'
import { cryptoRandomStringAsync } from 'crypto-random-string'

let addProduct = async (req, res) => {
    let stringIdFeedBack = await cryptoRandomStringAsync({length : 24 , type : "hex"})
    const { common, cate, link, about, describe} = req.body
    Category.find({"category.url_category" : link.url_category} , (err, results) => {
        let arr_size = results[0].category.category_sub
        let index = 0
        for( var i = 0 ; i < arr_size.length ; i++ ){
            if(arr_size[i].url_category_sub === link.url_category_sub){
                index = i
            }
        }
        arr_size[index].quantity = arr_size[index].quantity + 1
        Category.updateOne({"category.url_category" : link.url_category} , {$set : { 'category.category_sub' : arr_size}} , { $currentDate: { lastUpdated: true } } , (err, results)=> {
            if(err) throw err
        })
    })

    const feedBack = new FeedBack({
        '_id' : new ObjectId(stringIdFeedBack),
        "content_feedback" : []
    })

    const new_product = new Product({
        "common" : common,
        "cate" : cate,
        "link" : link,
        'about' : about,
        "describe" : describe,
        "feedback" : new ObjectId(stringIdFeedBack)
    })

    feedBack.save(err => {
        if(err) throw err
    })
    
    new_product.save(err => {
        if(err) throw err
    })
    res.send(JSON.stringify({
        "addProduct" : true
    }))
}


let deleteProduct = (req, res) => {
    const { id_product , url_category , url_category_sub } = req.body
    Category.find( {"category.url_category" : url_category}, (err, results) =>{
        let arr_size = results[0].category.category_sub
        let index = 0
        for( var i = 0 ; i < arr_size.length ; i++ ){
            if(arr_size[i].url_category_sub === url_category_sub){
                index = i
            }
        }
        arr_size[index].quantity = arr_size[index].quantity - 1
        Category.updateMany({"category.url_category" : url_category} ,{$set : { 'category.category_sub' : arr_size}}, { $currentDate: { lastUpdated: true } }, (err, results) => {
            if(err) throw err
        }) 
    })
    Product.deleteOne({"_id" : new ObjectId(id_product)} , (err) => {
        if(err) throw err
    })
    res.send(JSON.stringify({
        "deleteProduct" : true,
        "id_product_delete" : id_product
    }))
}

let updateProduct = (req, res) => {
    console.log(req.body)
    const {id_product, new_common, new_about, new_describe  } = req.body
    Product.updateMany({"_id" : new ObjectId(id_product)}, { $set : {common : new_common , about : new_about , describe : new_describe}}, (err, results) => {
        if(err) throw err
    })
    res.send(JSON.stringify({updateProduct : true}))
}

let product = {
    addProduct,
    deleteProduct,
    updateProduct
}

export default product