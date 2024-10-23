const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const sequelize = require('./db'); // Import sequelize instance
const studentRoutes = require('./routes/studentRoutes'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const announcementsRoutes = require('./routes/announcements');

// Configure CORS to allow requests from your front-end URL
app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin
    methods: ['GET', 'POST','PUT','DELETE','PATCH'], // Specify allowed methods
    allowedHeaders: ['Content-Type'], // Specify allowed headers
}));

app.use(express.json());

// Student routes
app.use('/api', studentRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/announcements', announcementsRoutes);


// Sync database and start the server
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false })  // Adjust 'force' to true if needed
    .then(() => {
        console.log('Database connected successfully.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
