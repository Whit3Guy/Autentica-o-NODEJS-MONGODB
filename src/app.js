require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../.env')
const User = require('./models/User') 
const porta = 3301;

// Config json response

app.use(
    express.json()
)
app.use(
    express.urlencoded({extended:true})
)

//credenciais
const uri = process.env.Database_Connection;
const secret = process.env.SECRET

//Public Routes
app.get("/", async (req, res)=>{
    res.status(200).json({status:"foi"})

})

//Register User

app.post("/auth/register", async (req, res)=>{
    const {name, email, password, confirm_password} = req.body

    if(!name){
        res.status(422).json({msg:"o nome é obrigatório"})
        return
    }
    if(!email){
        res.status(422).json({msg:"o email é obrigatório"})
        return
    }
    if(!password){
        res.status(422).json({msg:"a senha é obrigatório"})
        return
    }
    if(!confirm_password){
        res.status(422).json({msg:"a senha de confirmação é obrigatório"})
        return
    }
    if(password !== confirm_password){
        res.status(422).json({msg:"as senhas não coincidem"})
        return
    }
    //check if user exists
    const user_exist = await User.findOne({email:email})
    if(user_exist){
        res.status(422).json({msg:"Por favor, utilize outro email"})
        return
    }
    
        //hashing password
    const salt = await bcrypt.genSalt(12)
    const passord_hash = await bcrypt.hash(password, salt)

    const user = await User({name, email, password:passord_hash,})

    //create User
    try{
    await user.save()
    res.status(200).json({msg:`Usuario ${name} criado com sucesso`})
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg:"Aconteceu um erro em nosso servidor, tente novamente mais tarde"})
    }
})

// Login User

app.post("/auth/login", async (req, res)=>{
    const {email, password} = req.body

    const user = await User.findOne({email:email})

    //validações
    if(!email){
        res.status(422).json({msg:"O email é obrigatório"})
        return
    }
    if(!password){
        res.status(422).json({msg:"A senha é obrigatório"})
        return
    }

    // check if user exist
    if(!user){
        res.status(422).json({msg:"Você não possui uma conta"})
        return
    }
    
    //check if passwords match
    
    const check_passwords = await bcrypt.compare(password, user.password)
    if(!check_passwords){
        res.status(404).json({msg:"senha invalida"})
        return
    }
    
    res.status(200).json({msg:`Logado com sucesso ${user.name}!`})
})


mongoose.connect(uri).then(
    ()=>{
        console.log("conexão com o banco concluída")
    app.listen(porta, (error) => {
        console.log(error || "api subiu")
    })}
).catch((error)=> {
    console.log(error)
})
