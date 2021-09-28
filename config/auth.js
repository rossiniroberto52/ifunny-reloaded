const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

//model user
require("../models/user")
const User = mongoose.model("user")

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({email: email}).then((user) => {
            if(!user){
                return done(null, false, {message: "this account not exist"})
            }

            bcrypt.compare(password, user.password, (erro, batem) => {
                if(batem){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "wrong password"})
                };
            })
        })
    }))

    passport.serializeUser((user,done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err,user) => {
            done(err, user)
        })
    })
}




