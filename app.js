const express = require('express');
const app = express();


// Importando rotas
const home_routes = require('./routes/home');


// Utilizando as rotas
app.use('/', home_routes);




app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000, () => {
    console.log(`Servidor rodando! Link: http://localhost:3000`);
});