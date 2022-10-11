import { User } from "../../MongoBD/SchemaUser.mjs"
import { ObjectId } from "mongodb"
import formidable from 'formidable'
import AuthToken from '../Auth/token.mjs'

let GetInforUser = (req, res) => {
    const { refreshtoken } = req.body
    User.find({"_id" : new ObjectId(req.body.id_user)} , {infor_user : 1} , (err, results) => {
        res.send(JSON.stringify({
            refreshtoken,
            infor_user : results[0].infor_user
        }))
    })
}

let UpdateUser = (req, res) => {
    const dataUpdate = req.body.data
    const { refreshtoken } = req.body
    User.updateMany({ "_id"  : new ObjectId(req.body.id_user)} , { $set : { infor_user : dataUpdate } } , {infor_user : 1} , (err, results) => {
        if(err) throw err
        res.send(JSON.stringify({
            update : true,
            refreshtoken,
            user_update : dataUpdate
        }))
    })
}



let UpdateAvatar = (req, res) => {
    const { id_user, refreshtoken } = req.body
    console.log(id_user)
    let form = new formidable.IncomingForm();
    form.parse(req)
    form.on('fileBegin' , (name , file) => {
        file.filepath =  'src/avatar/' + file.originalFilename
        let linkAvatar = 'http://localhost:3800/avatar/' + file.originalFilename
        User.updateMany({ "_id"  : new ObjectId(id_user)}, { $set : { "infor_user.pic" : linkAvatar }}, (err, results) => {
            if(err) throw err
            res.send(JSON.stringify({
                refreshtoken,
                "avatar_update" : linkAvatar
            }))
        })
    })
}

let user = {
    GetInforUser,
    UpdateUser,
    UpdateAvatar
}

export default user




