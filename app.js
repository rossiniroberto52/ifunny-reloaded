const mysql = require('mysql')

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