const jwt = require('jsonwebtoken')
const express = require('express')
const roleRouter = require('./roleRoutes')
const coursesRouter = require('./coursesRoute')
const adminRouter = express.Router()
const {db,entities} = require('../../models')

const User = db['User']
const Role = db['Role']
const Privelege = db['Privelege']
const Entity = db['Entity']
module.exports =(entityName)=>{

    const canAccessUser =(req,res,next)=>{
        const token = req.headers.authorization
        if(token){
           
            jwt.verify(token,'ala-is-the-king',async (err,decodedToken)=>{
                if(!err){
                    const user_id = decodedToken.id
                    if(user_id){
                            const user = await User.findOne({where:{id:user_id},
                                    include:[{
                                        model:Role

                                        },
                                        {
                                        
                                        model:Privelege,
                                        include:[{
                                            model:Entity
                                        }]
                                    }]
                            
                            }
                            )
                            if(user){
                                //console.log(user.Priveleges)
                                const privelege = user.Priveleges.filter(p=>p.Entity.name==entityName)
                                if(privelege.length>0){
                                    if(privelege[0].score>0){
                                        req.currentUser = user   
                                        
                                        next() 
                                        
                                    }
                                    else{
                                        res.send(403)
                                    }
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
        
                }
                else{
                
                    res.sendStatus(403)
                }
        
        
        
            })
        
        
        }
        else{
            res.sendStatus(403)
        }
    
    
        }
        
return canAccessUser 
}


