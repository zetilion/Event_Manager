const express = require('express');
const db = require('../db');

const router = express.Router();

// 📌 Ottenere tutte le notifiche di un utente
router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    const sql = "SELECT * FROM notifications WHERE user_id = ?";
    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 📌 Contrassegnare una notifica come letta
router.put('/mark-as-read/:notification_id', (req, res) => {
    const notification_id = req.params.notification_id;

    const sql = "UPDATE notifications SET seen = 1 WHERE id = ?";
    db.query(sql, [notification_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Notifica contrassegnata come letta" });
    });
});

// 📌 Eliminare una notifica
router.delete('/delete/:notification_id', (req, res) => {
    const notification_id = req.params.notification_id;

    const sql = "DELETE FROM notifications WHERE id = ?";
    db.query(sql, [notification_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Notifica eliminata" });
    });
});

module.exports = router;
