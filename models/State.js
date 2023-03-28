
module.exports = (sequelize,DataTypes)=>{
    const State  = sequelize.define('State',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        stateId: {
            type: DataTypes.BLOB,
            
        },
        progress:{
            type: DataTypes.INTEGER,
            
        }
    
    
    
    
    })
    return State
    
    
}
    