import jwt from "jsonwebtoken"
import { jwtKey } from "../config/env.config.js"

export const generateToken = (user) => {
    const token = jwt.sign({user}, jwtKey, {expiresIn: '1d'});
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