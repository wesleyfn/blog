const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const mysql = require('../db');


router.get('/', (req, res) => {
    res.redirect('/');
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM User WHERE user_name = ?';
    mysql.query(sql, [username], async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];

            // Comparar a senha fornecida com a senha armazenada no banco de dados
            const passwordMatch = await bcrypt.compare(password, user.user_password);
            if (passwordMatch) {
                // Autenticação bem-sucedida, salve informações do usuário na sessão se necessário
                req.session.user = user;
                console.log('Usuário logado com sucesso');
                res.redirect(req.get('referer'));
            } else {
                // Senha incorreta
                res.send('Senha incorreta');
            }
        } else {
            // Usuário não encontrado
            res.send('Usuário não encontrado');
        }
    });
});

module.exports = router;