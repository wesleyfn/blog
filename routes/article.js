const express = require('express');
const router = express.Router();
const mysql = require('../db');

// Função para gerar uma SQL query ordenada de acordo com o sortBy
function generate_SQL(id) {
    return `
    SELECT
        Article.*,
        User.user_name AS article_author,
        Comment.comment_content,
        CommentUser.user_name AS comment_author_name
    FROM Article
    LEFT JOIN User ON Article.fk_user_creator = User.id_user
    LEFT JOIN Comment ON Article.id_article = Comment.fk_article
    LEFT JOIN User AS CommentUser ON Comment.fk_user_creator = CommentUser.id_user
    WHERE Article.id_article = ${id};
    `;
}

// Função para gerar uma SQL query para atualizar o conteúdo do artigo
function generate_update_SQL(id, content) {
    return `UPDATE Article SET article_body = '${content}' WHERE id_article = ${id};`;
}

// Função para gerar uma SQL query para deletar um artigo específico
function generate_delete_SQL(id) {
    return `DELETE FROM Article WHERE id_article = ${id};`;
}

router.get('/:id_article', (req, res) => {
    const sql = generate_SQL(req.params.id_article);

    mysql.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('article', {
            data: result
        });
    });
});

// Rota para processar a submissão do formulário de edição
router.post('/:id_article/edit', (req, res) => {
    const id_article = req.params.id_article;
    const new_content = req.body.article_content;

    const updateSQL = generate_update_SQL(id_article, new_content);

    mysql.query(updateSQL, (err, result) => {
        if (err) throw err;

        // Redirecionar de volta para a visualização do artigo após a edição
        res.redirect(`/article/${id_article}`);
    });
});

// Rota para processar a solicitação de exclusão
router.post('/:id_article/delete', (req, res) => {
    const id_article = req.params.id_article;

    const delete_SQL = generate_delete_SQL(id_article);

    mysql.query(delete_SQL, (err, result) => {
        if (err) throw err;

        // Redirecionar de volta para a lista de artigos após a exclusão
        res.redirect('/');
    });
});

module.exports = router;