const express = require('express')
const port = 3100
const multer = require('multer')
const path = require('path')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const mongoose = require("mongoose")

//configs
const storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

const app = express();
    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    //body-Parser
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())
    //mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/ifunny2").then(() => {
            console.log('[+]mongo connected')
        }).catch((err) => {
            console.log('[-]fail to connect mongo db!, error => ' + err)
        })
    //public
        app.use(express.static(path.join(__dirname,"public")))
//rotas
    app.use('/admin', admin)
//server listen
app.listen(port, () => {console.log('[+]server started on port 3100')});