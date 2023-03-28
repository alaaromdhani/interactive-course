
module.exports = (sequelize,dataTypes)=>{
const Entity = sequelize.define('Entity',{

    id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: dataTypes.STRING,
        unique:true
    }

    



})
return Entity



}