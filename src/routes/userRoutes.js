const express = require('express')

const userRoutes = express.Router()
const {db,entities} = require('../../models')
const { InvalidConnectionError, where } = require('sequelize')
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken')
const privelegeCkeck = require('../utils/privelegesCkeck')
const Role = db['Role']
const Entity = db['Entity']
const Privelege = db['Privelege']
const User = db['User']
const PDFDocument = require('pdfkit-table');
const blobStream = require('blob-stream');





userRoutes.post('/add',async (req,res)=>{
    const role = await Role.findOne({ where: { id:req.body.RoleId },include:{model:Privelege}})
    const currentUser = req.currentUser
    const test = privelegeCkeck.canCreateEntity(currentUser,'User')
    if(test){
        if(currentUser.Role.score<=role.score){
            User.add(async (data,err)=>{
                if(err){
                    if(err.name.includes("SequelizeUniqueConstraintError")){
        
                        let fieldName = err.parent.sqlMessage.split("clef")[err.parent.sqlMessage.split("clef").length-1].trim()
                        res.json({errorName:fieldName})
                    }
                    else{
        
                        res.json({errorName:"unknown"})
                    }
                }
                else{
                    const user = data    
                    
                   
                    
                    let privs = []
                
                role.Priveleges.forEach(p=>{
                    privs.push({score:p.score,EntityId:p.EntityId,UserId:user.id})
        
        
                })  
                
                await Privelege.bulkCreate(privs)
                res.json(user)
        
        
                }
        
            },req.body)
            
    
        }else{
            res.sendStatus(403)   
        
        }    
        
    }
    else{
        res.sendStatus(403)
    }
    
    
    
    
   
    

    
    


})

userRoutes.post('/update/priveleges/',async (req,res)=>{
    
     
    
    if(req.query.id){
            const user = await User.findOne({where:{id:req.query.id},include:{
                model:Role


            }})
        if(user){
            let canAccessEntities = true
            
            req.body.forEach(p=>{
                if(!privelegeCkeck.canAccessEntity(req.currentUser,p.EntityId)){
                    canAccessEntities = false
                }
        
            })
            
            const test = canAccessEntities && privelegeCkeck.canUpdateEntity(req.currentUser,'User') && privelegeCkeck.canAccessRole(req.currentUser,user.Role.score)
            if(test){
                Privelege.updateAll((data,err)=>{
                    if(err){
                    res.send({error:'unknown'})   
                    }
                    else{
                        res.send({status:200})
                    }
    
    
                },req.body)
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
        res.send(403)
    }


})
/*userRoutes.get('/entities',async (req,res)=>{
    const entities = await Entity.findAll()
    res.json(entities)


})
userRoutes.post('/role/show',async (req,res)=>{

    const role = await Role.findOne({ where: { id:5 },include:{model:Privelege}})
    res.json(role)
})*/
userRoutes.get('/all',async(req,res)=>{
    let entityIds = req.currentUser.Priveleges.filter(p=>p.score==15).map(p=>p.Entity.id)
    /*console.log(entityIds)*/
    let users = await User.findAll({
        include:[
            {
                model:Privelege,
                include:[{
                    model:Entity,
                    where:{
                        id:{[sequelize.Op.in]:entityIds}
                    }
                   
                    
                   
                }]
            },
            {
                model:Role
            }



        ],
        attributes: ['id', 'username', 'email','phonenumber']


    })
    users = users.filter(u=>u.Role.score>req.currentUser.Role.score)

    res.json(users)

})
userRoutes.get('/add',async(req,res)=>{

    if(privelegeCkeck.canCreateEntity(req.currentUser,'User')){

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

userRoutes.get('/verify',(req,res)=>{
        const token = req.headers.authorization
        if(token){
            jwt.verify(token,'ala-is-the-king',(err,decodedToken)=>{

                    if(err){
                        res.json({error:"unkown"})

                    }
                    else{
                        console.log(decodedToken)
                        res.send({status:'fine'})

                    }


            })
            
        }
        else{
            res.json({error:"unkown"})
            
        }
        



})
userRoutes.get('/api/pdf', async (req, res) => {
    if(privelegeCkeck.canReadEntity(req.currentUser,'User')){
        let users = await User.findAll({
            include:[
              
                {
                    model:Role
                    
                }
    
    
    
            ],
            attributes: ['id', 'username', 'email','phonenumber']
    
    
        })
        let data = []
        users = users.filter(u=>u.Role.score>req.currentUser.Role.score)
        .forEach(u=>{
            data.push({username:u.username,email:u.email,phonenumber:u.phonenumber})
        })
        
        
        const doc = new PDFDocument();
        doc.pipe(res);
    
        const table = {
            title: "Users",
            
            headers: [
              { label: "username", property: 'username', width: 60, renderer: null },
              { label: "email", property: 'email', width: 150, renderer: null }, 
              { label: "phonenumber", property: 'phonenumber', width: 100, renderer: null }, 
              
            ],
            // complex data
            datas: data
            // simeple data
            
          };
          doc.table(table, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
              doc.font("Helvetica").fontSize(8);
              indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15);
            },
          });
        doc.end();
      
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
        });


    }else{
        res.sendStatus(403)
    }
});
module.exports = userRoutes
