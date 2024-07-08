const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const porta = 3301;


app.get("/", (req, res)=>{
    res.status(200).json({status:"foi"})
})

app.listen(porta, (error) => {
    console.log(error || "api subiu")
})