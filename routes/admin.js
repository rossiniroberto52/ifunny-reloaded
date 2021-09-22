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
    const newCategory = {
        name: req.body.name,
        slug: req.body.slug
    };

    new Category(newCategory).save().then(() => {
        console.log('[+]registred on DB!')
    }).catch((err) => {
        console.log('[-]fail to registry with db => ' + err)
    })
})

module.exports = router