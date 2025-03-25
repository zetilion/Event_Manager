const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 📌 Importazione delle route
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const bookingsRoutes = require('./routes/bookings')


app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/bookings', bookingsRoutes); 

// 📌 Avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server avviato sulla porta ${PORT}`);
});
