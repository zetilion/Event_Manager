const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// 📌 Configurazione connessione al database
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "event_management"
});

// 📌 Connessione al database
db.connect(err => {
    if (err) {
        console.error("❌ Errore di connessione al database:", err.message);
        return;
    }
    console.log("✅ Connesso al database MySQL");
});

module.exports = db;
