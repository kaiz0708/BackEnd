import express from "express"
import managerUserAdmin from "../API_for_admin/ManagerUser/GetUser.mjs"
import product from "../API_for_admin/ManagerProduct/Product.mjs"
import bill from '../API_for_admin/ManagerBill/BillPay.mjs'
var Router = express.Router()

let APIadmin = (app) => {

    Router.get('/user' , managerUserAdmin.ManagerUser)
    Router.get('/delete/user' , managerUserAdmin.ManagerUserDelete)
    Router.post('/get_bill/id_user' , managerUserAdmin.ManagerGetBillUser)
    Router.post('/add/product' , product.addProduct)
    Router.post('/delete/product' , product.deleteProduct)
    Router.post('/update/product' , product.updateProduct)
    Router.post('/get_bill' , bill.getStateBill)
    Router.post('/get_bill_accept' , bill.updateAccept)
    Router.post('/get_bill_ship' , bill.updateShip)
 
    return app.use('/admin/manager' , Router)
}

export default APIadmin