const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


// Importando rotas
const home_routes = require('./routes/home');
const article_route = require('./routes/article');
const register_route = require('./routes/register');


// Utilizando as rotas
app.use('/', home_routes);
app.use('/article', article_route);

const mysql = require('./db');
const bcrypt = require('bcrypt');

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const sql = `
        INSERT INTO 
            User (user_name, user_password, user_email, user_create_time) 
        VALUES (?, ?, ?, NOW())
    `
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Salvar usuário no banco de dados
    mysql.query(sql, [username, hashedPassword, email], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});



/* // Middleware para configurar a sessão
app.use(session({
    secret: 'seu-segredo',
    resave: true,
    save_uninitialized: true
})); */

// Middleware para verificar se o usuário está autenticado
/* const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};
 */

app.listen(3000, () => {
    console.log(`Servidor rodando! Link: http://localhost:3000`);
});