const express = require('express')
const port = 3100
const multer = require('multer')
const path = require('path')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const Post = require('./models/Post')

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

//configs
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())

app.get('/', (req,res) => {
    res.redirect('/main')
})

app.get('/main', (req,res) => {
    res.sendFile(__dirname + '/html/index.html')
})

app.get('/cad', (req,res) => {
    
    res.render('formulario')
})

app.post('/add', (req,res) => {
    Post.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    }).then(()=>{
        res.send(res.redirect('/main'))
    }).catch((erro)=>{
        res.send('um erro apareceu! => ' + erro)
    })
})

app.get('/home', (req,res) => {
    Post.findAll({horder: [['id', 'DESC']]}).then((posts) => {
        res.render('home', {posts: posts})
    })
})

app.get('/deletar/:id', (req,res) => {
    Post.destroy({where: {'id': req.params.id}}).then(()=>{
        res.send('sucesso!')
    }).catch((erro)=>{
        res.send('postagem inexistente!')
    })
})

app.get('/login', (req,res) => {
    res.sendFile(__dirname + '/html/login.html')
})

app.get('/upload', (req,res) => {
    app.set('view engine', "ejs");
    res.render("upload");
});

app.post('/upload', upload.single('image'), (req,res) => {
    res.send('meme upload', res.redirect('/main'));
    
});

app.listen(port, () => {console.log('[+]server started on port 3100')})