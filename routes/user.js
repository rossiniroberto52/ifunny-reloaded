const express = require('express')
const router= express.Router()
const mongoose = require('mongoose')
require("../models/user")
const User = mongoose.model("user")
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get("/register", (req,res) => {
    res.render("users/register")
})

router.post("/register", (req,res) => {
    var erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        erros.push({text: "Invalid Name"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({text: "Invalid Email"})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        erros.push({text: "Invalid password"})
    }

    if(req.body.password.length < 6){
        erros.push({text: "your password is too small"})
    }

    if(req.body.password != req.body.password2){
        erros.push({text: "passwords not match try again!"})
    }

    if(erros > 0){
        req.flash("error_msg", "error!", {error: error})
        res.redirect("/users/register")
    }else{
        const newUser = new User({
           name: req.body.name,
           email: req.body.email,
           password: req.body.password
       }) 

       bcrypt.genSalt(saltRounds, function(err, salt) {
           bcrypt.hash(newUser.password, salt, function(err, hash){
                newUser.password = hash   
                newUser.save()
                req.flash("success_msg", "new User created!")
                res.redirect("/")
           })
       })
       
    }
})

module.exports = router