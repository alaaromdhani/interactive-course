const { where, Op } = require("sequelize")

module.exports = (sequelize,dataTypes)=>{
    const Privelege = sequelize.define('Privelege',{
    
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        score: {
            type: dataTypes.INTEGER,
            
        }
    
        
    
    
    
    })
    Privelege.updateAll = function(callback,priveleges){

        Privelege.bulkCreate(priveleges.map(p=>{
            return {id:p.id,score:p.score}

        }),{
            updateOnDuplicate: ['score']
        }).then(()=>{

            callback({status:200},null)
        }).catch(err=>{

            callback(null,err)
        })


    }
    return Privelege
    
    
    
    }