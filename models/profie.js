const { SequelizeUniqueConstraintError } = require('sequelize');
module.exports = (sequelize,DataTypes)=>{
    const Profile  = sequelize.define('Profile',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.BLOB,
            allowNull:true
          
        }
        

    
    
    
    
    })
    return Profile
    
    
    
    }
    