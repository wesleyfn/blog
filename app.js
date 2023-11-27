const express = require('express');
const app = express();


// Importando rotas
const home_routes = require('./routes/home');
const article_route = require('./routes/article');


// Utilizando as rotas
app.use('/', home_routes);
app.use('/article', article_route);




app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000, () => {
    console.log(`Servidor rodando! Link: http://localhost:3000`);
});