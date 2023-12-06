const express = require('express');
const router = express.Router();
const mysql = require('../db');

// Middleware para executar antes de cada rota
router.use((req, res, next) => {

    // Execute as consultas ao banco de dados
    if (req.session.user && req.session.user.id_user) {
        const userArticlesQuery = `
            SELECT COUNT(*) AS userArticleCount 
            FROM Article WHERE fk_user_creator = ${req.session.user.id_user}
        `;
        
        console.log(req.session.user.id_user);
        mysql.query(userArticlesQuery, (err, userResult) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao obter a contagem de artigos do usuário');
            }
            res.locals.userArticleCount = userResult[0].userArticleCount; // Atualize a variável global com o resultado da consulta
        });
    }

    const totalArticlesQuery = 'SELECT COUNT(*) AS totalArticleCount FROM Article';
    mysql.query(totalArticlesQuery, (err, totalResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao obter a contagem total de artigos');
        }
        res.locals.totalArticleCount = totalResult[0].totalArticleCount; // Atualize a variável global com o resultado da consulta
        next(); // Chame o próximo middleware ou rota
    });
});

// Middleware para tornar as variáveis visíveis em todas as rotas
router.use((req, res, next) => {
    res.locals.userArticleCount = res.locals.userArticleCount || 0; // Defina um valor padrão se a variável não estiver definida
    res.locals.totalArticleCount = res.locals.totalArticleCount || 0; // Defina um valor padrão se a variável não estiver definida
    next(); // Chame o próximo middleware ou rota
});

module.exports = router;
