const { Sequelize } = require('sequelize');
require('dotenv').config(); 

// Create a new Sequelize instance with the connection parameters
const sequelize = new Sequelize(process.env.DATABASE_URL, {                   
  dialect: 'postgres',           
  // logging: false,                
  dialectOptions: {
    ssl: {
      require: false,            
      rejectUnauthorized: false   
    }
  }
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Call the test function
testConnection();

// Export the sequelize instance for use in other parts of your app
module.exports = sequelize;
