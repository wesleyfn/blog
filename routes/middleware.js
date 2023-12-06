const setUserVariable = (req, res, next) => {
    res.locals.user = req.session.user || null; // Se não houver usuário na sessão, define como null
    next();
};


module.exports = setUserVariable;
