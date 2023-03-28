const Role = require('./Role')
const bcrypt = require('bcrypt');
module.exports = (sequelize,DataTypes)=>{
const User  = sequelize.define('User',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true


    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true
       

    },
    phonenumber:{
        type: DataTypes.INTEGER,
        allowNull:false,
        unique:true
       

    },
    
    password:{
        type: DataTypes.STRING,
        allowNull:false,
        
       

    },
    
}

  



)
User.add =  function(callback,user){
    User.create(user).then(user=>{
        callback(user,null)

    }).catch(error=>{
        
        callback(null,error)
    })




}

User.login = async function(username,password) {
    const user =  await User.findOne({ where: { username }});
    if(user){

      const test =   await bcrypt.compare(password, user.password);
        if(test){

            return user.id
        }

    }
    else{
     return -1
    }     
   }
 
User.beforeSave(async(user, options) => {
    // do something before saving the user
    // e.g. hash the password
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

     
  });
  return User
}
