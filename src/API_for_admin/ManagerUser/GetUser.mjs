import { User } from '../../MongoBD/SchemaUser.mjs'
import { Pay } from '../../MongoBD/SchemaPay.mjs'
import { ObjectId } from 'mongodb'
import { customInforBillAdmin } from '../Featear/featearAdmin.mjs'



let ManagerUser = (req, res) => {
    User.find({"infor_account.type" : process.env.USERAUTH} , (err, users) => {
        res.send(JSON.stringify({
            user : users.map(user => {
                return {
                    "infor_user" : user.infor_user,
                    "infor_account" : user.infor_account,
                    "id_user" : user._id.toString()
                }
            })
        }))
    })
}

let ManagerUserDelete = (req, res) => {
    User.deleteOne({ "_id" : new ObjectId(req.query.id_user)} , (err,) => {
        if(err) throw err
    })
    res.send(JSON.stringify({
        deleteUser : true,
    }))
}


let ManagerGetBillUser = (req, res) => {
    const { id_user } = req.body
    const { status } = req.body
    Pay.find({ $and : [
        { "id_user" : id_user }, 
        { "status_product.title" : status }
    ]}, (err, results) => {
        res.send(JSON.stringify({
           bill : customInforBillAdmin(results) 
        }))
    }).populate('product.id_product', 'common')
}



let managerUserAdmin = {
    ManagerUser,
    ManagerUserDelete,
    ManagerGetBillUser
}

export default managerUserAdmin