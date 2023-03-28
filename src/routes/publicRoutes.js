const express = require('express')
const publicRoutes = express.Router()
const {db,entities} = require('../../models')
const getMenuItems = require('../assets/menu')
const Entity =db['Entity']
publicRoutes.get('/verify',(req,res)=>{
    if(req.currentUser){
        const menuItems = getMenuItems(req.currentUser)
        res.json({user:req.currentUser,menu:menuItems})
    }
    else{
        res.sendStatus(403)
    }


})
publicRoutes.get('/entities',async (req,res)=>{
    const entities = await Entity.findAll()
    res.json(entities)


})
module.exports = publicRoutes