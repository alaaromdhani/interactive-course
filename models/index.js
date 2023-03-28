'use strict';

const fs = require('fs');

const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const entities= new Map() 

let sequelize;
if (config.use_env_variable) {
  config.logging = console.log
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  config.logging = console.log
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    
    db[model.name] = model;
    
  });
  db['User'].belongsTo(db['Role'])
  db['Role'].hasMany(db['User'], { onDelete: 'CASCADE' });
  db['Privelege'].belongsTo(db['Role'])
  db['Role'].hasMany(db['Privelege'],{onDelete:"CASCADE"})
  db['Privelege'].belongsTo(db['User'])
  db['User'].hasMany(db['Privelege'],{onDelete:"CASCADE"})
  db['Privelege'].belongsTo(db['Entity'])
  db['Entity'].hasMany(db['Privelege'],{onDelete:"CASCADE"})
  db['State'].belongsTo(db['User'])
  db['User'].hasMany(db['State'],{onDelete:"CASCADE"})
  db['State'].belongsTo(db['Course'])
  db['Course'].hasMany(db['State'],{onDelete:"CASCADE"})
  
Object.keys(db).forEach(modelName => {
  
  if (db[modelName].associate) {
    
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {db,entities};
