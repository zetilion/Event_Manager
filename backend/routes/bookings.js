const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/book', (req, res) => {
    const { user_id, event_id, seats_booked } = req.body;

    if (!user_id || !event_id || !seats_booked) {
        return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    const checkSeatsSql = "SELECT available_seats FROM events WHERE id = ?";
    db.query(checkSeatsSql, [event_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Evento non trovato" });

        const availableSeats = results[0].available_seats;
        if (seats_booked > availableSeats) {
            return res.status(400).json({ error: "Posti insufficienti" });
        }

        const updateSeatsSql = "UPDATE events SET available_seats = available_seats - ? WHERE id = ?";
        db.query(updateSeatsSql, [seats_booked, event_id], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });

            const bookSql = "INSERT INTO bookings (user_id, event_id, seats_booked) VALUES (?, ?, ?)";
            db.query(bookSql, [user_id, event_id, seats_booked], (insertErr) => {
                if (insertErr) return res.status(500).json({ error: insertErr.message });
                res.json({ message: "Prenotazione effettuata con successo" });
            });
        });
    });
});

module.exports = router;

