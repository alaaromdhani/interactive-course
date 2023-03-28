const express = require('express')

const {db,entities} = require('../../models')
const { canAccessEntity, canReadEntity, canCreateEntity, canUpdateEntity } = require('../utils/privelegesCkeck')
const Role = db['Role']
const Entity = db['Entity']
const Privelege = db['Privelege']
const User = db['User']
const roleRouter = express.Router()
roleRouter.post('/add',async (req,res)=>{
    if(canCreateEntity(req.currentUser,'Role')){

        try{
            const r = {name:req.body.name,score:req.body.score}
            const priveleges = req.body.priveleges
            const role = await Role.create(r)
            
            priveleges.forEach(element => {
                element.RoleId = role.id
        
        
            }); 
            const prevs = await Privelege.bulkCreate(priveleges)
            res.json({prevs})
        
           }
           catch(err){
            console.log(typeof(err.name))
            
            if(err.name.includes("SequelizeUniqueConstraintError")){
        
                let fieldName = err.parent.sqlMessage.split("clef")[err.parent.sqlMessage.split("clef").length-1].trim()
                res.json({errorName:fieldName})
            }
            else{
                res.json({errorName:"unkonwn"})
            }
            
           }
           
    }
    else{
        res.sendStatus(403)
    }
     
     
   
     
})
roleRouter.get('/add',(req,res)=>{

    if(canReadEntity(req.currentUser,'Role')){

            res.json({score:req.currentUser.Role.score})
    }
    else{
        res.sendStatus(403)
    }


})
roleRouter.get('/all',async (req,res)=>{

    if(privelegeCkeck.canReadEntity(req.currentUser,'Role')){

        let entityIds = req.currentUser.Priveleges.filter(p=>p.score==15).map(p=>p.Entity.id)
        let roles = await Role.findAll({
            
            include:[{
               model:Privelege,
               include:[{
                model:Entity,
                where:{
                    id:{[sequelize.Op.in]:entityIds}
                }
    
                
               }]
    
    
            }]
        
        
        })
        roles = roles.filter(r=>r.score>req.currentUser.Role.score)
        res.json(roles)

    }
    else{
        res.sendStatus(403)
    }



})
roleRouter.post("/update/priveleges",async (req,res)=>{
    if(canUpdateEntity(req.currentUser,'Role')){
        let entityIds = req.currentUser.Priveleges.filter(p=>p.score==15).map(p=>p.Entity.id)
        let test = true
         req.body.map(p=>p.EntityId).forEach(id=>{
            if(!entityIds.includes(id)){
                test = false
            }
    
    
        })
        if(test){
            if(req.query.id){
    
            
           
                let priveleges = await Privelege.findAll({
                 where:{RoleId:null},
                 include:{
                     
                     model:User,
                     where:{RoleId:req.query.id}
                   
         
                 },attributes:['id', 'EntityId', 'score'] 
                })
                priveleges.forEach(p=>{
                 p.score = req.body.filter(pr=>pr.EntityId==p.EntityId)[0].score
         
         
                })
                priveleges = priveleges.concat(req.body)
                Privelege.updateAll((data,err)=>{
                     if(data){
                         res.send({status:'fine'})
                     }
                     else{
                         res.send({error:'unknown'})
         
                     }
         
         
                },priveleges)
                
         
             }
             else{
                 res.sendStatus(403)
             }
    
    
        }
        else{
            res.sendStatus(403)
        }


     }
     else{
        res.sendStatus(403)
     }
    
    
 


})

module.exports = roleRouter