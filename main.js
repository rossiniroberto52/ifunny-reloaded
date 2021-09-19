const express = require('express')
const port = 3100
const multer = require('multer')
const path = require('path')
const mysql = require('mysql')

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

const con = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'rossini135',
    database: 'admins'
});

con.connect((err) => {
    if (err) {
        console.log('Erro connecting to database...', err)
        return
    }
    console.log('Connection established!')
})

con.end((err) => {
    if(err) {
        console.log('Erro to finish connection...', err)
        return 
    }
    console.log('The connection was finish...')
})

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
    res.send('meme upload' + "<br/>" + `<input type="button" value="mandar" onclick="location.replace('/main')">`);
    
});

app.listen(port, () => {console.log('[+]server started on port 3100')})