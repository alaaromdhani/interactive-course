

const  privelegeCkeck  = {
    convertScore : function (score,privelegesArray){
        
        if(score-8>=0){
            score-=8
            privelegesArray.push('DELETE')
            return this.convertScore(score,privelegesArray)

        }
        if(score-4>=0){
            score-=4
            privelegesArray.push('WRITE')
            return this.convertScore(score,privelegesArray)

        }
        if(score-2>=0){
            score-=2
            privelegesArray.push('CREATE')
            return this.convertScore(score,privelegesArray)

        }
        if(score-1>=0){
            score--
            privelegesArray.push('READ')
            return this.convertScore(score,privelegesArray)

        }
        return privelegesArray

},
canAccessEntity : function canAccessEntity(currentUser,entityId){
    const privelege = currentUser.Priveleges.filter(p=>p.Entity.id==entityId)
    if(privelege.length>0){
        if(privelege[0].score==15){
            return true

        }
        else{
            return false
        }

    }
    else{
        return false
    }



},
canAccessRole : function canAccessRole(currentUser,score){
    return currentUser.Role.score<score
},
canReadEntity:function canReadEntity(currentUser,entityName){
        const privelege = currentUser.Priveleges.filter(p=>p.Entity.name===entityName)
        if(privelege.length>0){
            privelegesArray = privelegeCkeck.convertScore(privelege[0].score,[])
            return privelegesArray.includes('READ')
        }
        else{
            return false
        }

},

canCreateEntity: function canCreateEntity(currentUser,entityName){
    const privelege = currentUser.Priveleges.filter(p=>p.Entity.name===entityName)
    if(privelege.length>0){
        privelegesArray = privelegeCkeck.convertScore(privelege[0].score,[])
        return privelegesArray.includes('CREATE')
    }
    else{
        return false
    }

},

canUpdateEntity : function canUpdateEntity(currentUser,entityName){
    const privelege = currentUser.Priveleges.filter(p=>p.Entity.name===entityName)
   
    if(privelege.length>0){
        
        let privelegesArray = privelegeCkeck.convertScore(privelege[0].score,[])
        return privelegesArray.includes('WRITE')
    }
    else{
        return false
    }

},

canDeleteEntity : function canDeleteEntity(currentUser,entityName){
    const privelege = currentUser.Priveleges.filter(p=>p.Entity.name===entityName)
    if(privelege.length>0){
        privelegesArray = privelegeCkeck.convertScore(privelege[0].score,[])
        return privelegesArray.includes('DELETE')
    }
    else{
        return false
    }

}

}
module.exports = privelegeCkeck