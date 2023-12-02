const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Middleware para configurar a sessão
app.use(session({
    secret: 'secretpasswoard',
    resave: true,
    saveUninitialized: true
}));


// Importando rotas
const setUserVariable = require('./routes/middleware');
const home_routes = require('./routes/home');
const article_route = require('./routes/article');
const register_route = require('./routes/register');
const login_route = require('./routes/login');
const logout_route = require('./routes/logout');

// Utilizando as rotas
app.use(setUserVariable);
app.use('/', home_routes);
app.use('/register', register_route);
app.use('/login', login_route);
app.use('/logout', logout_route);
app.use('/article', article_route);


app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

app.listen(3000, () => {
    console.log(`Servidor rodando! Link: http://localhost:3000`);
});