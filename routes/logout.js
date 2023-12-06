const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Limpar a sessão (fazer logout)
    req.session.destroy(() => {
        res.redirect(req.get('referer'));
    });
});

module.exports = router;