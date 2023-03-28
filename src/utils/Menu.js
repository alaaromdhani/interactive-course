class Menu {
    constructor( id,
                 title,
                 routerLink,
                 href,
                 icon,
                 target,
                 hasSubMenu,
                 parentId,entity,minScore) {
                    this.id = id
                    this.title=title
                    this.routerLink=routerLink
                    this.href=href
                    this.icon=icon
                    this.target=target
                    this.hasSubMenu=hasSubMenu
                    this.parentId=parentId,
                    this.entity = entity,
                    this.minScore = minScore



                 }
  }

module.exports = Menu
