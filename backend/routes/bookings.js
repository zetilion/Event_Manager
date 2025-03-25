const express = require('express');
const db = require('../db');
const router = express.Router();

// Middleware per autenticazione (opzionale, se vuoi proteggere le API)
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Accesso negato" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token non valido" });
    }
};

// 📌 **1. Prenotare un evento**
router.post('/book', (req, res) => {
    const { user_id, event_id, seats_booked } = req.body;

    // Controlla se ci sono posti disponibili
    const checkSeatsSql = "SELECT available_seats FROM events WHERE id = ?";
    db.query(checkSeatsSql, [event_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Evento non trovato" });

        const availableSeats = results[0].available_seats;
        if (seats_booked > availableSeats) {
            return res.status(400).json({ error: "Posti insufficienti" });
        }

        // Riduci il numero di posti disponibili
        const updateSeatsSql = "UPDATE events SET available_seats = available_seats - ? WHERE id = ?";
        db.query(updateSeatsSql, [seats_booked, event_id], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });

            // Inserisci la prenotazione
            const bookSql = "INSERT INTO bookings (user_id, event_id, seats_booked) VALUES (?, ?, ?)";
            db.query(bookSql, [user_id, event_id, seats_booked], (insertErr, result) => {
                if (insertErr) return res.status(500).json({ error: insertErr.message });
                res.json({ message: "Prenotazione effettuata con successo" });
            });
        });
    });
});

// 📌 **2. Ottenere le prenotazioni di un utente**
router.get('/my-bookings/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    const sql = `
        SELECT b.id, e.title, e.date, b.seats_booked 
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE b.user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 📌 **3. Cancellare una prenotazione**
router.delete('/cancel/:booking_id', (req, res) => {
    const booking_id = req.params.booking_id;

    // Recupera il numero di posti prenotati prima di cancellare
    const getSeatsSql = "SELECT event_id, seats_booked FROM bookings WHERE id = ?";
    db.query(getSeatsSql, [booking_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Prenotazione non trovata" });

        const { event_id, seats_booked } = results[0];

        // Elimina la prenotazione
        const deleteSql = "DELETE FROM bookings WHERE id = ?";
        db.query(deleteSql, [booking_id], (deleteErr) => {
            if (deleteErr) return res.status(500).json({ error: deleteErr.message });

            // Ripristina i posti disponibili nell'evento
            const restoreSeatsSql = "UPDATE events SET available_seats = available_seats + ? WHERE id = ?";
            db.query(restoreSeatsSql, [seats_booked, event_id], (updateErr) => {
                if (updateErr) return res.status(500).json({ error: updateErr.message });
                res.json({ message: "Prenotazione annullata e posti ripristinati" });
            });
        });
    });
});

module.exports = router;
