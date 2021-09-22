const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Category")
const Category = mongoose.model("categorys")

router.get('/', (req,res) => {
    res.render("admin/index")
})

router.get('/posts', (req,res) =>{
    res.send("posts page")
})

router.get('/category', (req,res) => {
    res.render("admin/category")
})

router.get('/category/add', (req,res) => {
    res.render("admin/addcategory")
})

router.post('/category/new', (req,res) => {

    var erros = []

    if(!req.body.name || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: "Invalid Name!"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text:"Invalid Slug!"})
    }

    if(req.body.name.length < 2){
        erros.push({text: "Category name is too small!"})
    }

    if(erros.length > 0){
        res.render("admin/addcategory", {erros: erros})
    }else{
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
    };

        new Category(newCategory).save().then(() => {
            req.flash("success_msg", "category created!")
            res.redirect("/admin/category")
        }).catch((err) => {
            req.flash("error_msg", "error to save category try again!")
            res.redirect("/admin")
        })
    }

    
})

module.exports = router