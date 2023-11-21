var express = require("express");
var app = express();
var db = require('./db.js');

app.set("engine ejs", "ejs");
app.use(express.urlencoded({ extended: false }));

//Configurar middleware para servir arquivos estáticos
app.use(express.static('public'));

//rotas...
app.get('/', function (req, res) {
    const sql = `
        SELECT 
            Artigo.id_artigo,
            Artigo.titulo,
            Artigo.conteudo,
            Artigo.n_curtidas,
            Autor.nome_autor,
            GROUP_CONCAT(TipoArtigo.nome_tipo_artigo) as tipos_artigo
        FROM 
            Artigo 
        INNER JOIN 
            Autor ON Artigo.fk_autor = Autor.id_autor 
        INNER JOIN 
            ArtigoTipoAssociacao ON Artigo.id_artigo = ArtigoTipoAssociacao.fk_artigo
        INNER JOIN 
            TipoArtigo ON ArtigoTipoAssociacao.fk_tipo_artigo = TipoArtigo.id_tipo_artigo
        GROUP BY 
            Artigo.id_artigo;
    `

    db.query(sql, function (err, result) {
        if (err) throw err;

        res.render('home.ejs', {
            data: result
        });
    });
});

app.listen(3000, () => {
    console.log('SERVIDOR ATIVO, ACESSE http://localhost:3000');
});