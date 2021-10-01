const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Category")
const Category = mongoose.model("categorys")
require('../models/Posts')
const Posts = mongoose.model("posts")
const {isAdmin} = require('../helpers/isAdmin')


router.get('/', isAdmin, (req,res) => {
    res.render("admin/index")
})

router.get('/category', (req,res) => {
    Category.find().sort({date:'desc'}).lean().then((category) => {
        res.render("admin/category", {category: category})
    }).catch((err) => {
        req.flash("error_msg", "erro to list the categorys")
        res.redirect("/admin")
    })
    
})

router.get('/category/add', isAdmin, (req,res) => {
    res.render("admin/addcategory")
})

router.post('/category/new', isAdmin, (req,res) => {

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

router.get("/category/edit/:id", isAdmin, (req,res) => {
    Category.findOne({_id:req.params.id}).then((category) => {
        res.render("admin/editcategory", {category: category})
    }).catch((err) => {
        req.flash("error_msg", "this category not exists!")
        res.redirect("/admin/category")
    })
    
})

router.post("/category/edit", isAdmin, (req,res) => {
    Category.findOneAndUpdate({_id: req.body.id}, {name: req.body.name, slug: req.body.slug}, {lean: true}).then(() => {
        req.flash("success_msg", "category edited!")
        res.redirect("/admin/category")
    }).catch((err) => {
        req.flash("error_msg", "error to edit category")
        console.log('error => ' + err)
        res.redirect("/admin/category")
    })
})

router.post("/category/delet", isAdmin, (req,res) => {
    Category.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "deleted category!")
        res.redirect("/admin/category")
    }).catch((err) => {
        req.flash("error_msg", "error to delete category")
        res.redirect("/admin/category")
    })
})

router.get('/posts', isAdmin, (req,res) => { 
    Posts.find().populate("category").sort({data:"desc"}).then((posts) => {
        res.render("admin/posts", {posts:posts})
    }).catch((err) => {
        req.flash("error_msg", "has ben error to load posts!")
        console.log("error with load posts found => " + err)
        res.redirect("/admin")
    })
})

router.get("/posts/add", isAdmin, (req,res) =>{
    Category.find().then((categorys) =>{
        res.render("admin/postsadd", {categorys: categorys})
    }).catch((err) => {
        console.log("error => " + err)
        req.flash("error_msg", "error to load form")
    })
    
})


router.post("/posts/new", isAdmin, (req,res) => {

    var erros = []

    if(req.body.category == "0"){
        erros.push({text: "invalid category create a category"})
    }

    if(erros.length > 0){
        res.render("admin/postsadd", {erros: erros})
    }else{
        const newPost = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category,
            slug: req.body.slug
        }

        new Posts(newPost).save().then(() => {
            req.flash("success_msg", "post has ben created")
            res.redirect("/admin/posts")
        }).catch((err) => {
            req.flash("error_msg", "error to save post")
            console.log('error to save post => ' + err)
            res.redirect("/admin/posts")
        })
    }

})

router.get('/posts/edit/:id', isAdmin, (req,res) => {
    Posts.findOne({_id: req.params.id}).then((post) =>{
        Category.find().then((category) => {
            res.render("admin/editposts", {category: category, post: post})
        }).catch((err) => {
            req.flash("error_msg", "error to list categorys!")
            console.log("error to list categorys => " + err)
            res.redirect("/admin/posts")
        })

    }).catch((err) => {
        req.flash("error_msg", "error to load update form!")
        console.log("error to load editon form => " +err)
        res.redirect("/admin/posts")
    })

})


router.post("/posts/edit", isAdmin, (req,res) => {
    Posts.findOneAndUpdate({id: req.body.id}, {title: req.body.title, slug: req.body.slug, description: req.body.description, content: req.body.content, category: req.body.category}, {lean: true}).then((post) => {
            req.flash("success_msg","post saved!")
            res.redirect("/admin/posts")
    }).catch((err) => {
        req.flash("error_msg", "error to edit post")
        console.log("error => " +err)
        res.redirect("/admin/posts")
    })
})


router.get("/posts/delet/:id", isAdmin, (req,res) => {
    Posts.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg", "post deleted")
        res.redirect("/admin/posts")
    }).catch((err) => {
        req.flash("error_msg", "intern error")
        res.redirect("/admin/posts")
    })
})

module.exports = router