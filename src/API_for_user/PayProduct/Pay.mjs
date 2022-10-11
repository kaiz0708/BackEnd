import { Pay } from "../../MongoBD/SchemaPay.mjs"
import { Cart } from "../../MongoBD/SchemaCart.mjs"
import { Product } from '../../MongoBD/SchemaProduct.mjs'
import { ObjectId } from "mongodb"
import  Queue  from './QueuePay.mjs'
import {customInforBill} from '../../Featear/featear.mjs'

let find = async (params) =>{
    return await Product.find(params)
}

let checkQuantity = async (product) => {
    const {id_product , size , quantity } = product
    let data = await find({"_id" : new ObjectId(id_product)})
    let arr_size = data[0].about.size
    let index = 0;
    for( var i = 0 ; i < arr_size.length ; i++){
        arr_size[i].size_name === size ? index = i : null
    }

    if(arr_size[index].quantity >= quantity){
        arr_size[index].quantity = arr_size[index].quantity - quantity
        Product.updateMany({"_id" : new ObjectId(id_product)}, {$set : {"about.size" : arr_size}} , { $currentDate: { lastUpdated: true } } , (err , results) => {
            if(err){
                throw err
            }
        })
        return true
    }else{
        return false
    }
}


let PayProduct = async (req , res) => {
    const { id_user , infor_user, product } = req.body
    const { refreshtoken } = req.body
    let check = await checkQuantity(product)
    if(check){
        let new_pay = Pay({
            "user" : {
                "id_user" : id_user,
                ...infor_user
            },
            "product" : {
                ...product,
                date : new Date()
            },
            "status_product" : {
                title : process.env.WAITACCEPT,
                status : false
            }
        })
        
        new_pay.save(err => {
            if(err) throw err
        });
        res.send(JSON.stringify({
            buy_product : true,
            refreshtoken
        }))
    }else{
        res.send(JSON.stringify({
            buy_product : false,
            refreshtoken
        }))
    }
}

let payProductInCart = async (req, res) => {
    const { id_user , infor_user, product , refreshtoken } = req.body
    let listIdCartResponse = {
        "success" : [],
        "fail" : []
    }
    let Product = new Queue()

    for( let i = 0 ; i < product.length ; i++){
        Product.addValue(product[i])
    }

    while(Product.length() !== 0){
        let { title_product, product , id_cart } = Product.dequeue()
        let check = await checkQuantity(product)
        if(check){
            Cart.deleteMany({"_id" : new ObjectId(id_cart)} , (err, results) =>{
                if(err) throw err
            })
            let new_pay = Pay({
                "user" : {
                    "id_user" : id_user,
                    ...infor_user
                },

                "product" : {
                    ...product,
                    "date" : new Date()
                },

                "status_product" : {
                        title : process.env.WAITACCEPT,
                        status : false
                    }
                })
                    
                new_pay.save(err => {if(err) throw err});
                listIdCartResponse.success.push(id_cart)
        }else{
            listIdCartResponse.fail.push({
                "title" : title_product,
            })
        }
    }
    res.send(JSON.stringify({
        "dataResponse" : listIdCartResponse,
        refreshtoken
    }))
}


let DeletePayProduct = (req, res) => {
    let { id_bill , id_product , quantity , size } = req.body.bill
    quantity = Number(quantity)
    Product.find({"_id" : new ObjectId(id_product)} , (err , results) => {
        let arr_size = results[0].about.size
        for( var i = 0 ; i < arr_size.length ; i++){
            arr_size[i].size_name === size ? arr_size[i].quantity = arr_size[i].quantity + quantity : null
        }
        Product.updateOne({"_id" : new ObjectId(id_product)} , {$set : { "about.size" : arr_size }} , (err) => {
            if(err){
                throw err
            }
        })
    })
    Pay.deleteOne({"_id" : new ObjectId(id_bill)} , err => {
        console.log(err);
    })
    res.send(JSON.stringify({
        "id_bill" : id_bill,
        "delete_product" : true
    }))
}

let GetBillUser = (req, res) => {
    const { id_user  } = req.body
    const { status } = req.body
    const { refreshtoken } = req.body
    Pay.find({ $and : [
        { "user.id_user" : id_user }, 
        { "status_product.title" : status }
    ]} , (err, results) => {
        res.send(JSON.stringify({
            bill : customInforBill(results),
            refreshtoken
        }))
    }).populate("product.id_product", "common")
}

let AllBillUser = (req, res) => {
    const { id_user } = req.body
    const { refreshtoken } = req.body
    Pay.find({ "user.id_user" : id_user} , (err, results) => {
        res.send(JSON.stringify({
            bill : customInforBill(results),
            refreshtoken
        }))
    }).populate("product.id_product" , "common")
}

let AcceptBill = (req, res) => {
    const { id_bill } = req.body
    let state_product_new = {
        title : process.env.ACCEPTED,
        state : true
    }
    Pay.updateOne({"_id" : new ObjectId(id_bill)} , { $set : {"status_product" : state_product_new}}, (err) => {
        if(err) throw err
    })
    res.send(JSON.stringify({
        update : "success",
        id_bill : id_bill
    }))
}

let pay = {
    PayProduct,
    payProductInCart,
    DeletePayProduct,
    GetBillUser,
    checkQuantity,
    AcceptBill,
    AllBillUser
}

export default pay