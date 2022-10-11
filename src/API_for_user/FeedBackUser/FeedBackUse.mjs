import { FeedBack } from '../../MongoBD/SchemaFeedback.mjs'
import { ObjectId } from 'mongodb'
import { cryptoRandomStringAsync } from 'crypto-random-string'

let getFeedBack = async (params) => {
    let feed_back = await FeedBack.find(params)
    return feed_back
}

let FeedBackUser = async (req, res) => {
    console.log(req.body)
    let { username , avatar, id_user, content, id_feed } = req.body
    let stringIdFeedBack = await cryptoRandomStringAsync({length : 24 , type : "hex"})
    let timedate = new Date()
    let new_feed = {
        id_user,
        username,
        avatar,
        content,
        date : timedate.toLocaleDateString(),
        time : timedate.toLocaleTimeString(),
        like : 0,
        _id : new ObjectId(stringIdFeedBack) 
    }

    let feed_back = await getFeedBack({'_id' : new ObjectId(id_feed)})
    feed_back[0].content_feedback.push(new_feed)
    let new_content = [...feed_back[0].content_feedback]
    FeedBack.updateMany({"_id" : new ObjectId(id_feed)}, {$set : {content_feedback : new_content}} , {new : true} , (err, results) => {
        if(err) throw err
    })
    delete new_feed._id
    new_feed["_id"] = stringIdFeedBack
    res.send(JSON.stringify({
        'add' : true,
        new_feed
    }))
}

let DeleteFeedBack = async (req, res) => {
    let { id_feed, id_feed_sub } = req.body
    let feed_back = await getFeedBack({'_id' : new ObjectId(id_feed)})
    let new_content = feed_back[0].content_feedback.filter(ele => ele._id.toString() !== id_feed_sub)
    FeedBack.updateMany({"_id" : new ObjectId(id_feed)}, {$set : {content_feedback : new_content}} , {new : true} , (err, results) => {
        if(err) throw err
    })
    res.send(JSON.stringify({
        'delete' : true,
        "id_feed_sub" : id_feed_sub
    }))
}

let UpdateLike = async (req, res) => {
    let { check , id_feed , id_feed_sub} = req.body
    let feed_back = await getFeedBack({'_id' : new ObjectId(id_feed)})
    let new_content = [...feed_back[0].content_feedback]
    for( var i = 0 ; i < new_content.length ; i++ ){
        if(new_content[i]._id.toString() === id_feed_sub){
            if(check){
                new_content[i].like = new_content[i].like + 1;
            }else{
                new_content[i].like = new_content[i].like - 1;
            }
        }
    }
    FeedBack.updateMany({"_id" : new ObjectId(id_feed)}, {$set : {content_feedback : new_content}} , {new : true} , (err, results) => {
        if(err) throw err
    })
    res.send(JSON.stringify({'updateLike' : true}))
}


let Update_Feedback = async (req, res) => {
    let {  id_feed , id_feed_sub, content_new} = req.body
    let feed_back = await getFeedBack({'_id' : new ObjectId(id_feed)})
    let new_content = [...feed_back[0].content_feedback]
    for( var i = 0 ; i < new_content.length ; i++ ){
        if(new_content[i]._id.toString() === id_feed_sub){
            new_content[i].content = content_new
        }
    }
    FeedBack.updateMany({"_id" : new ObjectId(id_feed)}, {$set : {content_feedback : new_content}} , {new : true} , (err, results) => {
        if(err) throw err
    })
    res.send(JSON.stringify({
        'updateLike' : true,
        new_content
    }))
}

let feedback = {
    FeedBackUser,
    DeleteFeedBack,
    UpdateLike,
    Update_Feedback
}

export default feedback