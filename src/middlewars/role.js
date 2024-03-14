export const checkAdmin = (req, res, next) => {
    if(req.session.user.role !== "administrador"){
        return res.redirect('/');
    }
    next();
} 

export const checkUser = (req, res, next) => {
    if(req.session.user.role !== "usuario"){
        return res.redirect('/');
    }
    next();
} 