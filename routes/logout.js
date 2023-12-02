const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Limpar a sessão (fazer logout)
    console.log('Rota /logout acionada');
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;