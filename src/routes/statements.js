const express = require('express')
const statementsRouter= express.Router()
statementsRouter.put('',(req,res)=>{
        console.log(req.body)
    res.json({status:'got success'})

})
statementsRouter.get('',(req,res)=>{
   console.log('over with')
    res.json({status:'success'})



})
module.exports = statementsRouter