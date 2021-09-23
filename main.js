//modulos e consts
const express = require('express')
const port = 3100
const multer = require('multer')
const path = require('path')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const mongoose = require("mongoose")
const session = require('express-session')
const flash = require('connect-flash')

//configs
const app = express();

app.use(session({
    secret: "meunomeerossiniesouoprogramadordestaosta",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
//middleware
app.use((req,res,next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})
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


    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))
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