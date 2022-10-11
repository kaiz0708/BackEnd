import { FeedBack } from '../MongoBD/SchemaFeedback.mjs'
import { ObjectId } from 'mongodb'


let getFeedBack = async (params) => {
    let feed_back = await FeedBack.find(params)
    return feed_back
}

let UpdateLike = async (data) => {
    let { id_feed, id_feed_sub , check } = data
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
}

let RealTime = (io) => {
    io.on('connection' , (socket) => {

        socket.on('join' , data => {
            socket.join('room1')
        })

        socket.on('update_like' , async (data) => {
            UpdateLike(data)
            socket.to('room1').emit('update_state', data)
        })

        socket.on('send' , (data) => {
            console.log('lolololol')
            socket.to('room1').emit('accept' ,data)
        })
    })
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               

export default RealTime

