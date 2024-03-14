import { userModel } from "../dao/db/models/user.model.js"

export const checkAuth = (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
} 

export const checkExistingUser = (req, res, next) => {
    if(req.session.user){
        return res.redirect('/');
    }
    next();
}

// export const authorization = (role) => {
//     return async (req, res, next) => {
//         if (req.session?.user?.rol !== role) {
//             return res.status(403).send({error: "No permission"});
//         }
//         next();
//     }
// }