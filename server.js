const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = 5000; 

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Leader')
.then(() => {console.log('MongoDB connected locally!')})
.catch(err => console.error('Connection error:', err));




// Routes (will be defined later)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Leaderboard Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
