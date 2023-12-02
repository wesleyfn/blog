const express = require('express');
const router = express.Router();
const mysql = require('../db');

// Função para gerar uma SQL query ordenada de acordo com o sortBy
function generate_SQL(sort_by) {
    return `
    SELECT
        A.id_article,
        A.article_title,
        A.article_likes,
        U.user_name,
        COUNT(C.id_comment) AS article_comments,
        TIMESTAMPDIFF(SECOND, article_create_time, NOW()) AS diff_secs
    FROM Article AS A
    JOIN User AS U ON A.fk_user_creator = U.id_user
    LEFT JOIN Comment AS C ON A.id_article = C.fk_article
    GROUP BY A.id_article ORDER BY ${sort_by};
    `;
}

// Função para lidar com a lógica de rota
function handle_route(req, res, sort_by) {
    const sql = generate_SQL(sort_by);

    mysql.query(sql, (err, result) => {
        if (err) throw err;

        res.render('home', {
            data: result,
            user: req.session.user
        });
    });
}

// Rotas definidas usando funções modularizadas
router.get('/comentados', (req, res) => {
    handle_route(req, res, 'article_comments DESC');
});

router.get('/recentes', (req, res) => {
    handle_route(req, res, 'diff_secs DESC');
});

router.get('/', (req, res) => {
    handle_route(req, res, 'A.article_likes DESC');
});

module.exports = router;