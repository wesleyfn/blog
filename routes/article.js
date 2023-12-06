const express = require('express');
const router = express.Router();
const mysql = require('../db');

router.get('/create', (req, res) => {
    res.render('article/article_create');
});

router.get('/:id_article', (req, res) => {
    const sql = generateSelectSQL(req.params.id_article);

    mysql.query(sql, (err, result) => {
        if (err) throw err;

        res.render('article/article_select', {
            data: result
        });
    });
});

// Rota para processar a submissão do formulário de edição
router.post('/:id_article/edit', (req, res) => {
    const idArticle = req.params.id_article;
    const newTitle = req.body.article_title;
    const newBody = req.body.article_body;

    const updateSQL = `
        UPDATE 
            Article 
        SET 
            article_title = '${newTitle}', 
            article_body = '${newBody}' 
        WHERE id_article = ${idArticle};
        `;

    mysql.query(updateSQL, (err, result) => {
        if (err) throw err;

        // Redirecionar de volta para a visualização do artigo após a edição
        res.redirect(`/article/${idArticle}`);
    });
});

// Rota para processar a solicitação de exclusão
router.post('/:id_article/delete', (req, res) => {
    const idArticle = req.params.id_article;

    const deleteSQL = `DELETE FROM Article WHERE id_article = ${idArticle};`;

    mysql.query(deleteSQL, (err, result) => {
        if (err) throw err;

        // Redirecionar de volta para a lista de artigos após a exclusão
        res.redirect('/');
    });
});


// Rota para processar a solicitação de adicionar likes
router.post('/:id_article/like', (req, res) => {
    const idArticle = req.params.id_article;
    const action = req.body.action; // 'like' ou 'dislike'

    let updateSQL;

    if (action === 'like') 
        updateSQL = `UPDATE Article SET article_likes = article_likes + 1 WHERE id_article = ${idArticle}`;
    else if (action === 'notlike') 
        updateSQL = `UPDATE Article SET article_likes = article_likes - 1 WHERE id_article = ${idArticle}`;

    mysql.query(updateSQL, (err, result) => {
        if (err) throw err;

        // Enviar uma resposta indicando que a ação foi realizada com sucesso
        res.redirect(req.get('referer'));
    });
});

// Rota para processar a solicitação de inclusão
router.post('/create', (req, res) => {
    const articleTitle = req.body.article_title;
    const articleBody = req.body.article_body;
    const idAuthor = req.session.user.id_user;
    

    const insertSQL = `INSERT INTO Article (article_title, article_body, fk_user_creator, article_likes, article_create_time) 
                       VALUES ('${articleTitle}', '${articleBody}', ${idAuthor}, 0, NOW());`;

    mysql.query(insertSQL, (err, result) => {
        if (err) throw err;

        // Redirecionar de volta para a lista de artigos após a inclusão
        res.redirect('/');
    });
});

// Rota para processar a solicitação de inclusão
router.post("/:id_article/comment/create", (req, res) => {
    const idArticle = req.params.id_article;
    const idAuthor = req.session.user.id_user;
    const commentContent = req.body.comment_content;

    console.log(idAuthor);

    const insertSQL = `
        INSERT INTO Comment (comment_content, comment_create_time, fk_user_creator, fk_article) 
        VALUES ('${commentContent}', NOW(), ${idAuthor}, ${idArticle});`;

    mysql.query(insertSQL, (err, result) => {
        if (err) throw err;

        // Redirecionar de volta para a lista de artigos após a inclusão
        res.redirect(req.get('referer'));
    });
});

// Função para formatar o tempo decorrido em uma string legível
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

// Função para gerar uma SQL query para selecionar um artigo específico
function generateSelectSQL(id) {
    const diffSecs = 'TIMESTAMPDIFF(SECOND, article_create_time, NOW())';
    const formattedTime = formatTime(diffSecs);

    return `
    SELECT
        Article.*,
        User.user_name AS article_author,
        Comment.comment_content,
        CommentUser.user_name AS comment_author_name,
        ${diffSecs} AS diff_secs,
        ${formattedTime}
    FROM Article
    LEFT JOIN User ON Article.fk_user_creator = User.id_user
    LEFT JOIN Comment ON Article.id_article = Comment.fk_article
    LEFT JOIN User AS CommentUser ON Comment.fk_user_creator = CommentUser.id_user
    WHERE Article.id_article = ${id};
    `;
}

module.exports = router;