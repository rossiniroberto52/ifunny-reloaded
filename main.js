//modulos e requires
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
require("./models/Posts")
const Post = mongoose.model("posts")
require("./models/Category")
const Category = mongoose.model("categorys")
const users = require("./routes/user")
const passport = require('passport')
require("./config/auth")(passport)

//configs
const app = express();

//session config
app.use(session({
    secret: "menis",
    resave: true,
    saveUninitialized: true
}))
//passport config
app.use(passport.initialize())
app.use(passport.session())
//flash config
app.use(flash())

//middleware
app.use((req,res,next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.user = req.user || null;
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
    app.get("/", (req,res) => {
        Post.find().populate("category").sort({data: "desc"}).then((posts) => {
            res.render("index", {posts: posts})
        }).catch((err) => {
            req.flash("error_msg", "intern error")
            res.redirect("/404")
        })
        
    })

    app.get("/post/:slug", (req,res) => {
        Post.findOne({slug: req.params.slug}).then((post) => {
            if(post){
                res.render("post/index", {post: post})
            }else{
                req.flash("error_msg","this post not exist!")
                req.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "inter error!")
            res.redirect("/")
        })
    })

    app.get('/category', (req,res) => {
        Category.find().then((category) => {
            res.render("category/index", {category:category})
        }).catch((err) => {
            req.flash("error_msg", "inter error to list categorys")
            res.redirect("/")
        })
    })

    app.get("/category/:slug", (req,res) =>{
        Category.findOne({slug: req.params.slug}).then((category) => {
            if(category){
                Post.find({category: category._id}).then((post) => {
                    res.render("category/post", {post: post, category: category})
                }).catch((err) => {
                    req.flash("error_msg", "error to list posts!")
                    console.log("error to render category => " + err)
                    res.redirect("/")
                })
            }else{
                req.flash("error_msg", "category not found!.")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "internal error!")
            console.log('error => ' + err)
            res.redirect('/')
        })
    })
    
    app.get("/404", (req,res)=>{
        res.send("error: 404!")
    })

    app.use("/users", users)
    
    app.use('/admin', admin)
//server listen
app.listen(port, () => {console.log('[+]server started on port 3100')});