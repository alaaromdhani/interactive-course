const express = require('express')
const guestRoutes = express.Router()
const {db,entities} = require('../../models')
const jwt = require('jsonwebtoken');
const User = db['User']
const maxAge = 3*24*3600
const createToken = (id) => {
    return jwt.sign({ id }, 'ala-is-the-king', {
      expiresIn: maxAge
    });
};
guestRoutes.post('/login',async (req,res)=>{

    const {username,password} = req.body
    if(username && password){
            const result = await User.login(username,password)
        if(result!=-1){
            const token = createToken(result)
            res.send({token})

        }
        else{
            res.send({error:"not connected"})
        }

    }
    else{
        res.send({error:"not connected"})
    }
})
module.exports=guestRoutes
