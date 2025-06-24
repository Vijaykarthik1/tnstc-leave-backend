const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
app.use('/api/user', userRoutes);

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);


// Routes
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes'); // ✅ added leave routes

app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes); // ✅ add this line to connect frontend leave form

app.get('/', (req, res) => {
  res.send('TNSTC Leave Management Backend Running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));
