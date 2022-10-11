import { Pay } from '../../MongoBD/SchemaPay.mjs'
import { ObjectId } from "mongodb"
import { customInforBillAdmin } from '../Featear/featearAdmin.mjs'

let getStateBill = (req, res) => {
    const { status } = req.body
    console.log(status)
    Pay.find( {"status_product.title" : status } , (err, bills) => {
        res.send(JSON.stringify({
            bill :customInforBillAdmin(bills) 
        }))
    }).populate('product.id_product', 'common')
}

let updateAccept = (req, res) => {
    const { id_bill } = req.body
    let state_product_new = {
        title : process.env.GETPRODUCT,
        status : false
    }
    Pay.updateOne({"_id" : new ObjectId(id_bill)} , { $set : {"status_product" : state_product_new}} , (err) => {
        if(err) throw err
    })
    res.send(JSON.stringify({
        update : true,
        id_bill_delete : id_bill
    }))
}

let updateShip = (req, res) => {
    const { id_bill } = req.body
    let state_product_new = {
        title : process.env.SHIP,
        status: true
    }
    Pay.updateOne({"_id" : new ObjectId(id_bill)} , { $set : {"status_product" : state_product_new}}, (err) => {
        if(err) throw err
    })
    res.send(JSON.stringify({
        update : true,
        id_bill : id_bill
    }))
}



let bill = {
    getStateBill,
    updateShip,
    updateAccept,
}

export default bill













