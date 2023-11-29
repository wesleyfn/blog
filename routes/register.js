const express = require('express');
const router = express.Router();
const mysql = require('../db');
const bcrypt = require('bcrypt');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const sql = `
        INSERT INTO 
            User (user_name, user_password, user_email, user_create_time) 
        VALUES (?, ?, ?, NOW())
    `
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Salvar usuário no banco de dados
    mysql.query(sql, [username, hashedPassword, email], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

module.exports = router;