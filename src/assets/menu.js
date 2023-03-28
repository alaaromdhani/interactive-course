const Menu = require("../utils/Menu");

const menuItems = [new Menu (10, 'DASHBOARD', '/admin', null, 'dashboard', null, false, 0,'',0),
    new Menu (20, 'USERS', '/admin/users', null, 'grid_on', null, true, 0,'User',1),
    new Menu (201, 'add', '/admin/users/add', null, 'grid_on', null, false, 20,'User',2),
    new Menu (202, 'show', '/admin/users/read', null, 'grid_on', null, false, 20,'User',1),
    new Menu (21, 'ROLES AND PERSMISSIONS', '/admin/roles', null, 'category', null, true, 0,'Role',1),
    new Menu (211, 'add', '/admin/roles/add', null, 'category', null, false, 21,'Role',2),
    new Menu (212, 'show', '/admin/roles/read', null, 'category', null, false, 21,'Role',1),
    new Menu (22, 'COURSES', '/admin/courses', null, 'category', null, true, 0,'Course',1),
    new Menu (221, 'add', '/admin/courses/add', null, 'category', null, false, 22,'Course',2),
    new Menu (222, 'show', '/admin/courses/read', null, 'category', null, false, 22,'Course',1),

  ]
const getMenuItems = (currentUser)=>{
    return menuItems.filter(i=>{
        if(i.entity===''){
            return true
        }
        else{
            return i.minScore<=(currentUser.Priveleges.filter(p=>p.Entity.name==i.entity)[0].score)
        }

    }) 






}
module.exports=getMenuItems