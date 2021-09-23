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
    Category.find().sort({date:'desc'}).lean().then((category) => {
        res.render("admin/category", {category: category})
    }).catch((err) => {
        req.flash("error_msg", "erro to list the categorys")
        res.redirect("/admin")
    })
    
})

router.get('/category/add', (req,res) => {
    res.render("admin/addcategory")
})

router.post('/category/new', (req,res) => {

    var erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
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
            req.flash("error_msg", "error to save category, try again!")
            res.redirect("/admin")
        })
    }

})

router.get("/category/edit/:id", (req,res) => {
    Category.findOne({_id:req.params.id}).then((category) => {
        res.render("admin/editcategory", {category: category})
    }).catch((err) => {
        req.flash("error_msg", "this category not exists!")
        res.redirect("/admin/category")
    })
    
})

router.post("/category/edit", (req,res) => {
    Category.findOneAndUpdate({_id: req.body.id}, {name: req.body.name, slug: req.body.slug}).lean().then((category) => {
        category.lean().then(() => {
            req.flash("success_msg", "Category edited!")
            res.redirect("/admin/category")
        }).catch((err) => {
            req.flash("error_msg", "intern error to edit category!")
            console.log('error to edit category => ' + err)
            res.redirect("/admin/category")
        })
    }).catch((err) => {
        req.flash("error_msg", "error to edit category")
        console.log('=> ' + err)
        res.redirect("/admin/category")
    })
})
module.exports = router