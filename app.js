var express = require("express");
var app = express();
var mysql = require('./db.js');

app.set("engine ejs", "ejs");
app.use(express.urlencoded({ extended: false }));

//Configurar middleware para servir arquivos estáticos
app.use(express.static('public'));


//rotas...
app.get('/', function (req, res) {
    const sql = `
    SELECT 
        Article.article_title,
        Article.article_likes,
        User.user_name,
        COUNT(Comment.id_comment) AS article_comments,
        CASE 
            WHEN diff_secs < 60 THEN CONCAT(diff_secs, ' segundos atrás')
            WHEN diff_secs < 3600 THEN CONCAT(FLOOR(diff_secs / 60), ' minutos atrás')
            ELSE CONCAT(FLOOR(diff_secs / 3600), ' horas atrás')
        END AS time_posted
    FROM Article
    JOIN User ON Article.fk_user_creator = User.id_user
    LEFT JOIN Comment ON Article.id_article = Comment.fk_article
    JOIN (
        SELECT 
            TIMESTAMPDIFF(SECOND, Article.article_create_time, NOW()) AS diff_secs
        FROM Article
        WHERE Article.id_article = 1
    ) AS subquery ON 1 = 1
    GROUP BY Article.id_article;
    `

    mysql.query(sql, function (err, result) {
        if (err) throw err;

        res.render('base.ejs', {
            data: result
        });
    });
});

app.listen(3000, () => {
    console.log('SERVIDOR ATIVO, ACESSE http://localhost:3000');
});