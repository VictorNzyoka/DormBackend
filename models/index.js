'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

// Import models
const Student = require('./Student');
const Bed = require('./Bed');
const Dormitory = require('./Dormitory');
const User = require('./User');
const Announcement = require('./Announcement');

// Initialize models
Student.init(sequelize);
Bed.init(sequelize);
Dormitory.init(sequelize);
User.init(sequelize);
Announcement.init(sequelize);

// Initialize the database object
const db = {
    Student,
    Bed,
    Dormitory,
    User,
    Announcement,
    sequelize,
    Sequelize
};

// Define associations using the associate methods in each model
Object.values(db).forEach((model) => {
    if (model.associate && typeof model.associate === 'function') {
        model.associate(db);
    }
});

// Remove any explicit associations here - they're now handled in the model files

module.exports = db;