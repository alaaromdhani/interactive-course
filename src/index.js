const {db,entities} = require('../models')
const express = require('express')
const app = express()
const cors = require("cors")
const middleware = require('./routes/middleware')
const Entity = db['Entity']
const guestRoutes = require('./routes/guestRoute')
const userRoutes = require('./routes/userRoutes')
const roleRouter = require('./routes/roleRoutes')
const publicMiddleware = require('./routes/publicMiddleware')
const publicRoutes = require('./routes/publicRoutes')
const statementsRouter = require('./routes/statements')
const coursesRouter = require('./routes/coursesRoute')

const entity = [{name:'User'},{name:'Role'},{name:'Course'}]
db.sequelize.sync().then(async ()=>{
    console.log('done')
    //await Entity.bulkCreate(entity)
   /* const role  = await db['Role'].create({name:"SUPERADMIN",score:1})
    db['Entity'].findAll().then(e=>{
        let priveleges = []
        
        e.forEach(element => {
            priveleges.push({EntityId:element.id,score:15,RoleId:role.id})
        });
        db['Privelege'].bulkCreate(priveleges).then(privs=>{
                db['User'].create({username:"yasmine417",email:'yasmine417@test.tn',phonenumber:29208660,password:'123456',RoleId:role.id}).then(user=>{
                    let pr = []
                    priveleges.forEach(p=>{

                        pr.push({EntityId:p.EntityId,score:p.score,UserId:user.id})
                        
                    })
                    db['Privelege'].bulkCreate(pr).then(data=>{
                        console.log('done')

                    })


                })
        })

    })*/
  
  
   
        
})


app.use(express.json())
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  };
app.use(cors(corsOptions))
app.use('/guest',guestRoutes)
app.use('/admin/public',publicMiddleware(),publicRoutes)
app.use('/admin/role',middleware('Role'),roleRouter)
app.use('/admin/user',middleware("User"),userRoutes)
app.use('/admin/course',middleware('Course'),coursesRouter)
app.listen(3000,()=>{

    console.log('server is listening on port 3000')
})