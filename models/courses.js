
module.exports = (sequelize,DataTypes)=>{
    const Course  = sequelize.define('Course',{
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            
        },
        name: {
            type: DataTypes.STRING,
            unique:true
        },
        url:{
            type: DataTypes.STRING,
            unique:true
        }
    
    
    
    
    })
    return Course
    
    
}
    