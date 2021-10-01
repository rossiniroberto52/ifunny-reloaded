const bcrypt = require("bcryptjs")
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require('mongoose')
require("../models/user")
const User = mongoose.model("user")

module.exports = function(passport){
    
    function findUser(User) {
        return User.find(email => User.email === email);
    }

    function findUserById(id){
        return User.find(id => User._id === id);
    }

    passport.serializeUser((user,done) => {
        done(null, user._id);
    })

    passport.deserializeUser((id, done) => {
        try{
            const user = findUserById(id);
            done(null, user)
        }catch(err){
            console.log(err)
            return done(err, null)
        }
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        User.findOne({email: email}).then((user) => {
                if(!user){
                    throw new Error("user-not-found")
                }
                let compare = bcrypt.compareSync(password, user.password);

                if(!compare){
                    throw new Error("password-error")
                }
                return done(null, user)
            }).catch((err) => {
                console.log('error on compare function! or ' + err)
            })
        })
    );
}