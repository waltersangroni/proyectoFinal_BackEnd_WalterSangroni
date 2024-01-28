import jwt from "jsonwebtoken"

const PRIVATE_KEY = "C0d3rh0us3";

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '1d'});
    return token;
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: "Not authenticad"})
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error){
            return res.status(401).send({message: "Not authenticad"})
        }
        req.user = credentials;
        next()
    })
}