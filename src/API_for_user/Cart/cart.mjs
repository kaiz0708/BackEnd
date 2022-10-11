import { Cart } from '../../MongoBD/SchemaCart.mjs'
import { ObjectId } from 'mongodb'
import { cryptoRandomStringAsync } from 'crypto-random-string'
let AddCart = async (req , res) => {
    const { id_product , quantity, size } = req.body.cart
    const { id_user } = req.body
    const { refreshtoken } = req.body
    let stringId = await cryptoRandomStringAsync({length : 24 , type : "hex"})
    const new_cart = Cart({
        "_id" : new ObjectId(stringId),
        "id_user" : id_user,
        "product" : id_product,
        "quantity" : quantity,
        "size" : size
    })
    new_cart.save((err) => {
        console.log(err);
    })
    res.send(JSON.stringify({
        add : true,
        refreshtoken,
        id_cart : stringId
    }))
}

let DeleteCart = (req , res) => {
    const { id_cart } = req.body
    let id = new ObjectId(id_cart)
    Cart.deleteOne({ "_id" : id} , (err) => {
        if(err) throw err
    })
    res.send(JSON.stringify(
        {
            delete : true,
            id_cart : id_cart
        }
    ))
}

let cart = {
    AddCart,
    DeleteCart,
}

export default cart