const { SequelizeUniqueConstraintError } = require('sequelize');
module.exports = (sequelize,DataTypes)=>{
    const Role  = sequelize.define('Role',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull:false,
            unique: {
                name: 'name',
                msg: 'Role name already exists'
            }
          
        },
        score:{
            type: DataTypes.INTEGER,
            allowNull:false,
            

        }

    
    
    
    
    })
    Role.add =  function(callback,role){
        Role.create(role).then(role=>{
            callback(role,null)

    
        }).catch(error=>{
            console.log(error.fields)
            /*if (error instanceof SequelizeUniqueConstraintError) {
                    const fields = error.fields;
                    
                    const message = `Duplicate value for fields: ${Object.keys(fields).join(', ')}`;
                    console.log(message)
                }*/
            callback(null,error)
        })
    
    
    
    
    }
    return Role
    
    
    }
    