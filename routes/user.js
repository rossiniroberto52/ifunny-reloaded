const express = require('express')
const router= express.Router()
const mongoose = require('mongoose')
require("../models/user")
const User = mongoose.model("user")

router.get("/register", (req,res) => {
    res.render("users/register")
})





module.exports = router