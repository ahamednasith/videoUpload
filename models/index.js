const dbConfig = require('../dbConfig');
const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
    host:dbConfig.HOST,
    dialect:dbConfig.dialect,
    port:8889,
    timezone:'+05:30'
});

const db ={}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.phone =require('./otp.model')(sequelize,DataTypes);
db.profile = require('./profile.model')(sequelize,DataTypes);

db.sequelize.sync();

module.exports = db;
