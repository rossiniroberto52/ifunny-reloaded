const express = require('express')
const port = 3100
const multer = require('multer')
const path = require('path')

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

app.get('/', (req,res) => {
    res.redirect('/main')
})

app.get('/main', (req,res) => {
    res.sendFile(__dirname + '/html/index.html')
})

app.get('/login', (req,res) => {
    res.sendFile(__dirname + '/html/login.html')
})

app.set('view engine', "ejs");

app.get('/upload', (req,res) => {
    res.render("upload");
});

app.post('/upload', upload.single('image'), (req,res) => {
    res.send('meme upado com sucesso absoluto!');
    
});

app.listen(port, () => {console.log('Servidor na porta 3100 :)')})