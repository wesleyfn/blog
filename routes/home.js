const express = require('express');
const router = express.Router();
const mysql = require('../db');

function formatTime(diffSecs) {
    return `
    CASE
        WHEN ${diffSecs} >= 86400 THEN CONCAT(FLOOR(${diffSecs} / 86400), ' dia(s) atrás')
        WHEN ${diffSecs} >= 3600 THEN CONCAT(FLOOR(${diffSecs} / 3600), ' hora(s) atrás')
        WHEN ${diffSecs} >= 60 THEN CONCAT(FLOOR(${diffSecs} / 60), ' minuto(s) atrás')
        ELSE CONCAT(${diffSecs}, ' segundo(s) atrás')
    END AS formattedTime
    `;
}

function generate_SQL(sort_by) {
    const diffSecs = 'TIMESTAMPDIFF(SECOND, article_create_time, NOW())';
    const formattedTime = formatTime(diffSecs);

    return `
    SELECT
        Article.id_article,
        Article.article_title,
        Article.article_likes,
        User.user_name,
        COUNT(Comment.id_comment) AS article_comments,
        ${diffSecs} AS diff_secs,
        ${formattedTime}
    FROM Article
    JOIN User ON Article.fk_user_creator = User.id_user
    LEFT JOIN Comment ON Article.id_article = Comment.fk_article
    GROUP BY Article.id_article ORDER BY ${sort_by};
    `;
}

function handle_route(req, res, sort_by) {
    const sql = generate_SQL(sort_by);

    mysql.query(sql, (err, result) => {
        if (err) throw err;

        res.render('home', {
            data: result
        });
    });
}

router.get('/comentados', (req, res) => {
    handle_route(req, res, 'article_comments DESC');
});

router.get('/recentes', (req, res) => {
    handle_route(req, res, 'diff_secs ASC');
});

router.get('/', (req, res) => {
    handle_route(req, res, 'Article.article_likes DESC');
});


module.exports = router;