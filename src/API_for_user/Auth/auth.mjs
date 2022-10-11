import AuthToken from './token.mjs'
import 'dotenv/config'
import { Cart } from '../../MongoBD/SchemaCart.mjs'
import { User } from '../../MongoBD/SchemaUser.mjs'
import { ObjectId } from "mongodb"
import { RefreshToken } from '../../MongoBD/RefreshToken.mjs'
import { cryptoRandomStringAsync } from 'crypto-random-string'
import { customCart } from '../../Featear/featear.mjs'
import axios from 'axios'
import bcrypt from 'bcrypt'
const saltRounds = 10

let isValidEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

let createDataReponse = (res_data, account) => {

    const payload = {
        "id_user" : res_data.id_user,
        "account" : account
    }
    
    const token = AuthToken.CreateToken(payload, process.env.TOKEN_SECRET, process.env.TOKEN_LIFE)
    const refreshToken = AuthToken.CreateToken(payload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE)
    return {
        "token" : token,
        "refreshToken" : refreshToken,
        "data" : res_data
    }
}

let addRefreshToken = (id_user, account) => {
    const payload = {
        'id_user' : id_user,
        "account" : account
    }
    const refreshToken = AuthToken.CreateToken(payload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE)
    const refresh = new RefreshToken({
        "refreshtoken" : refreshToken,
        "id_user" : id_user
    })
    refresh.save((err) => {
        if(err) throw err
    })
}

let dataResponse = (id , username , avatar) => {
    return {
        "id_user" : id,
        "username" : username,
        "avatar" : avatar
    }
}

let Api_Refresh_Token = async (refreshtoken) => {
    let response =  await axios.post('http://localhost:3800/auth/refreshtoken' , {
        refreshtoken
    })
    let data = await response.data

    return data
}

let authenticate =  (req, res, next) => {
    if(req.body.token === undefined){
        var { token, refreshtoken } = req.headers
    }else{
        var { token, refreshtoken } = req.body
    }
    try {
        let decode = AuthToken.VerifyToken(token, process.env.TOKEN_SECRET)
        let { id_user } = decode
        req.body.id_user = id_user
        req.body.refreshtoken = false
        next()
    } catch (error) {
        Api_Refresh_Token(refreshtoken).then(dataResponse => {
            res.send(JSON.stringify(dataResponse))
        }) 
    }
}

let refreshToken = (req, res) => {
    let { refreshtoken } = req.body
    try {
        let decode = AuthToken.VerifyToken(refreshtoken, process.env.REFRESH_TOKEN_SECRET)
        RefreshToken.find({'id_user' : decode.id_user}, (err, results)=> {
            if(results.length === 0){
                res.send(JSON.stringify({
                    "refreshtoken" : true
                }))
            }else{
                let { id_user, account } = decode
                const new_token = AuthToken.CreateToken({ id_user, account}, process.env.TOKEN_SECRET, process.env.TOKEN_LIFE)
                res.send(JSON.stringify({
                    "refreshtoken" : true,
                    "new_token" : new_token
                }))
            }
        })
    } catch (error) {
        res.send(JSON.stringify({
            "refreshtoken" : true
        }))
    }
}


let AccountLogined = (req, res) => {
    let { id_user } = req.body
        Cart.find({"id_user" : id_user}, (err, carts) => {
            User.find({"_id" : new ObjectId(id_user)}, {"infor_user" : 1}, (err, results)=> {
                console.log(results[0].infor_user)
                res.send(JSON.stringify({
                    "refreshtoken" : false,
                    "user_basic_infor" : {
                        id_user,
                        username : results[0].infor_user.username,
                        avatar : results[0].infor_user.pic
                    },
                    "cart" : customCart(carts),
                }))
            })
        }).populate('product', 'common')
}

  

let LoginForm = (req, res) => {
    const {account , pass} = req.body
    User.find({"infor_account.account" : account} , (err , results) => {
        if(err) throw err

        if(results.length === 0){
            res.send(JSON.stringify({login : 'fail'}))
        }else{
            let checkPass = bcrypt.compareSync(pass, results[0].infor_account.pass)
            if(checkPass === false){
                res.send(JSON.stringify({login : 'fail'}))
            }
            else{
                if(results[0].infor_account.type === process.env.USERAUTH){
                    Cart.find({ "id_user" : results[0]._id.toString()} , (err, cart) => {
                        let res_data = dataResponse(results[0]._id.toString(), results[0].infor_user.username, results[0].infor_user.pic)
                        res.send(JSON.stringify({
                            "authorization" : process.env.USERAUTH,
                            "cart" : customCart(cart),
                            "user" : createDataReponse(res_data,account)
                        }))
                    }).populate("product" , "common")
                }else{
                    res.send(JSON.stringify({
                        "authorization" : process.env.ADMINAUTH,
                        "secret_id" : process.env.SECRET_ID
                    }))
                }
            }
        }
    })
}



let SignUpForm = async (req, res) => {
    console.log(process.env.SALTROUNDS)
    const {account , pass , name , username , date_of_birth , phone , address} = req.body
    let stringId = await cryptoRandomStringAsync({length : 24 , type : "hex"})
    if(isValidEmail(account) === false){
        res.send(JSON.stringify({signUp : 'fail'})) 
    }
    User.find({"infor_account.account" : account} , (err, results) => {

        if(err) throw err

        if(results.length !== 0){
            res.send(JSON.stringify({SignUpFail : 'fail'}))
        }else{
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(pass, salt)
            let new_user = new User({
                "_id" : new ObjectId(stringId),
                "infor_user" : {
                    "username" : username,
                    "name" : name,
                    "date_of_birth" : date_of_birth,
                    "phone" : phone,
                    "address" : address,
                    "pic" : " "
                },

                "infor_account" : {
                    "account" : account,
                    "pass" : hash,
                    "type" : process.env.USERAUTH
                }
            })
            new_user.save((err) => {
                console.log(err)
            })
            let res_data = dataResponse(stringId, username , ' ')
            addRefreshToken(stringId, account)
            res.send(JSON.stringify({
                "cart" : [],
                "user" : createDataReponse(res_data, account)
            }))
        }
    })
}


let LoginService = async (req, res) => {
    const {username , user_id } = req.body
    let stringId = await cryptoRandomStringAsync({ length : 24 , type : "hex" })
    User.find({"infor_account.account" : user_id} , (err , results) => {
    
        if(err) throw err

        if(results.length === 0){

            let new_user = User({
                "_id" : new ObjectId(stringId),
                "infor_user" : {
                    "username" : username,
                    "name" : "",
                    "date_of_birth" : "",
                    "phone" : "",
                    "address" : "",
                    "pic" : " "
                },

                "infor_account" : {
                    "account" : user_id,
                    "pass" : process.env.PASSDEFAULT,
                    "type" : process.env.USERAUTH
                }
            })

            new_user.save(err => {
                if(err) throw err
            })

            let res_data = dataResponse(stringId, username, ' ')
            addRefreshToken(stringId, user_id)
            res.send(JSON.stringify({
                "cart" : [],
                "user" : createDataReponse(res_data, user_id)
            }))

        }else{
            Cart.find({"id_user" : results[0]._id.toString()} , (err, cart) => {
                console.log(cart)
                let res_data = dataResponse(results[0]._id.toString(), results[0].infor_user.username, results[0].infor_user.pic)
                res.send(JSON.stringify({
                    "cart" : customCart(cart),
                    "user" : createDataReponse(res_data, user_id)
                }))
            }).populate("product", "common")
        }
    })
}


let Auth = {
    LoginForm,
    SignUpForm,
    LoginService,
    authenticate, 
    refreshToken,
    AccountLogined
}
export default Auth