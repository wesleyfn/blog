const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const mysql = require('../db');

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', async (req, res) => {
    const sql = `
        INSERT INTO 
            User (user_name, user_password, user_email, user_create_time) 
        VALUES (?, ?, ?, NOW())
    `;
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    // Salvar usuário no banco de dados
    mysql.query(sql, [username, hashedPassword, email], (err, result) => {
        if (err) throw err;
        console.log('Usuário registrado com sucesso');
        res.redirect('/');
    });
});

async function hashPassword(password) {
    const saltRounds = 10;
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Hash gerado com sucesso:', hash);
        return hash;
        // Agora você pode usar o hash, por exemplo, para armazenar no banco de dados
    } catch (err) {
        console.error('Erro ao gerar hash:', err);
    }
}

module.exports = router;