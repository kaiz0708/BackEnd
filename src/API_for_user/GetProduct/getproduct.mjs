import { Product } from '../../MongoBD/SchemaProduct.mjs'
import { Category } from '../../MongoBD/SchemaCategory.mjs'
import { Cart } from "../../MongoBD/SchemaCart.mjs"
import { ObjectId } from "mongodb"
import  AuthToken  from '../Auth/token.mjs'
import { User } from '../../MongoBD/SchemaUser.mjs'
import { customProductRes , toSlug , customProductInfor } from '../../Featear/featear.mjs'
import cart from '../Cart/cart.mjs'
let { PAGE } = process.env
let Create_Page = (lengthPage , value) => {
    let arr = []
    lengthPage % PAGE !==0 ? lengthPage = lengthPage / PAGE + 1 : lengthPage = lengthPage / PAGE 
    for( var i = 0 ; i  <= lengthPage - 1 ; i++){
        arr.push({
            page : i + 1,
            check : value
        })
    }
    return arr;
}

let ReturnQuantitySub = (arr , params) => {
    for( let i = 0 ; i < arr.length ; i++){
        if(arr[i].url_category_sub === params){
            return arr[i].quantity
        }
    }
}


let ReturnProductbyCategory = (req, res) => {
    let skip = Number(req.query.page)
    Category.find({ "category.url_category" : req.query.path_cate } , (err , results) => {
        let lengthPage = results[0].category.category_sub.reduce((prev , current) => {
            return prev + current.quantity
        } , 0);
        Product.find({"link.url_category" : req.query.path_cate} , {common : 1} , (err , products) => {
            res.send(JSON.stringify({
                infor_product : customProductRes(products),
                quantity_page : Create_Page(lengthPage , skip)
            }))
        }).skip(PAGE * skip - PAGE).limit(PAGE)
    })
}


let ReturnProductbyCategorySub = (req, res) => {
    let skip = Number(req.query.page) 
    Category.find({"category.url_category" : req.query.path_cate} , (err , results) => {
        let category_sub = results[0].category.category_sub
        Product.find({"link.url_category_sub" : req.query.path_cate_sub} , {common : 1} ,  (err, products) => {
            let lengthPage = ReturnQuantitySub(category_sub , req.query.path_cate_sub) 
            res.send(JSON.stringify({
                infor_product : customProductRes(products),
                quantity_page : Create_Page(lengthPage, skip)
            }));
        }).skip(PAGE * skip - PAGE).limit(PAGE)
    })
}

let ReturnProductbyId = (req, res) => {
    let Id = new ObjectId(req.query.id_product)
    Product.find({_id : Id} , (err , product) => {
        res.send(JSON.stringify(customProductInfor(product[0])))
    }).populate('feedback' , "content_feedback")
}


let Homepage = (req, res) => {
    Product.find({}, {common : 1} , (err, products) => {
        res.send(JSON.stringify({
            'infor_product' : customProductRes(products)
        }))
    }).limit(process.env.PAGEHOME).sort({$natural:-1})
}



let SearchProduct = (req, res) => {
    const { value } = req.query
    let content_search = toSlug(value)
    Product.find({ $or : [
        {"cate.category_sub" : content_search} , {"cate.category" : content_search}, {"cate.type" : content_search}
    ]} , { common : 1 } , (err, products) => {
        if(products.length===0){
            res.send(JSON.stringify({
                "search" : false
            }))
        }else{
            res.send(JSON.stringify({
                "search" : true,
                "results_search" : customProductRes(products)
            }))
        }
    })
}


let product = {
    ReturnProductbyCategory,
    ReturnProductbyCategorySub,
    ReturnProductbyId,
    SearchProduct,
    Homepage
}

export default product