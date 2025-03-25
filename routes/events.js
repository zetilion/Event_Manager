const express = require('express');
const db = require('../db');
const router = express.Router();

// 📌 OTTIENI TUTTI GLI EVENTI
router.get('/', (req, res) => {
    db.query("SELECT * FROM events", (err, results) => {
        if (err) return res.status(500).json({ error: "Errore nel recupero degli eventi" });
        res.json(results);
    });
});

// 📌 CREAZIONE EVENTO (FIXATO)
router.post('/create', (req, res) => {
    const { organizer_id, title, description, date, seats, image } = req.body;

    if (!organizer_id || !title || !description || !date || !seats) {
        return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    const sql = "INSERT INTO events (organizer_id, title, description, date, seats, available_seats, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [organizer_id, title, description, date, seats, seats, image], (err) => {
        if (err) return res.status(500).json({ error: "Errore nella creazione evento" });
        res.json({ message: "Evento creato con successo" });
    });
});

module.exports = router;

