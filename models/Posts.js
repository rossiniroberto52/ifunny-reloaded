const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Posts = new Schema({
    title:{
        type:String,
        required: true
    },
    slug: {
        type:String,
        required: true
    },
    descripton:{
        type:String,
        required: true
    },
    content:{
        type:String,
        required: true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: "categorys",
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model("posts", Posts)