const express = require('express');
const router = express.Router();
const mysql = require('../db');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Procurar usuário no banco de dados
    mysql.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) throw err;

        // Verificar senha
        if (results.length > 0 && (await bcrypt.compare(password, results[0].password))) {
            req.session.userId = results[0].id;
            return res.redirect('/dashboard');
        }

        res.redirect('/login');
    });
});

module.exports = router;