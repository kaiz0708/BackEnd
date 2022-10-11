import express from 'express' 
import Auth from '../API_for_user/Auth/auth.mjs'
import product from '../API_for_user/GetProduct/getproduct.mjs'
import cart from '../API_for_user/Cart/cart.mjs'
import pay from '../API_for_user/PayProduct/Pay.mjs'
import user from '../API_for_user/User/user.mjs'
import Feedback from '../API_for_user/FeedBackUser/FeedBackUse.mjs'
import { FeedBack } from '../MongoBD/SchemaFeedback.mjs'
import fs from 'fs'
import path from 'path';
import { cryptoRandomStringAsync } from 'crypto-random-string'
import { ObjectId } from 'mongodb'
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var Router = express.Router()




let APIuser = (app) => {
    Router.post('/login' , Auth.LoginForm)
    Router.post('/signup' , Auth.SignUpForm)
    Router.post('/loginService' , Auth.LoginService)
    Router.post('/add/cart' , Auth.authenticate,  cart.AddCart)
    Router.post('/delete/cart' , Auth.authenticate,  cart.DeleteCart)
    Router.post('/pay/product' , Auth.authenticate, pay.PayProduct)
    Router.post('/pay/product_cart' , Auth.authenticate,  pay.payProductInCart)
    Router.post('/delete/pay/product' , pay.DeletePayProduct)
    Router.post('/accept_bill' , pay.AcceptBill)
    Router.post('/user' , Auth.authenticate, user.GetInforUser)
    Router.post('/update_user' , Auth.authenticate, user.UpdateUser)
    Router.post('/pay/bill_user' , Auth.authenticate, pay.GetBillUser)
    Router.post('/pay/bill_user_all', Auth.authenticate, pay.AllBillUser)
    Router.post('/add/feedback' , Auth.authenticate,  Feedback.FeedBackUser)
    Router.post('/delete/feedback' ,  Feedback.DeleteFeedBack)
    Router.post('/update_like/feedback' , Feedback.UpdateLike)
    Router.post('/update/feedback' ,  Feedback.Update_Feedback)
    Router.get('/' , product.Homepage)
    Router.post('/logined', Auth.authenticate ,Auth.AccountLogined)
    Router.get('/product' , product.ReturnProductbyCategory)
    Router.get('/product_sub' , product.ReturnProductbyCategorySub)
    Router.get('/product_id' , product.ReturnProductbyId)
    Router.get('/search' , product.SearchProduct)
    Router.post('/update_avatar' , Auth.authenticate , user.UpdateAvatar)
    Router.get('/user_auth' , Auth.authenticate)

    app.use('/' , Router)
}

let APIauth = (app) => {
    Router.post('/refreshtoken' , Auth.refreshToken)
    app.use('/auth' , Router)
}

let API = {
    APIuser,
    APIauth
}

export default API