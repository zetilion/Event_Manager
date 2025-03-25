const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "segreto_super_sicuro";

// 📌 REGISTRAZIONE
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Errore nel database" });
        if (results.length > 0) return res.status(400).json({ error: "Email già registrata" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

        db.query(sql, [name, email, hashedPassword, role], (insertErr) => {
            if (insertErr) return res.status(500).json({ error: "Errore nel salvataggio utente" });
            res.json({ message: "Registrazione avvenuta con successo" });
        });
    });
});

// 📌 LOGIN
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Inserisci email e password" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Errore nel database" });
        if (results.length === 0) return res.status(401).json({ error: "Utente non trovato" });

        const user = results[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ error: "Password errata" });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role, user_id: user.id });
    });
});

module.exports = router;
