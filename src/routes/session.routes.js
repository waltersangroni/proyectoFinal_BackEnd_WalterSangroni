import { Router } from "express";
import { userModel } from "../dao/db/models/user.model.js";

const sessionRoutes = Router();

sessionRoutes.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const user = await userModel.create({
            first_name, last_name, age, email, password
        });
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            user.role = 'admin';
        } else {
            user.role = 'usuario';
        }
        await user.save();

        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(400).send({error});
    }
});

sessionRoutes.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }        
        if(user.password !== password){
            return res.status(401).send({message: 'Invalid credentials'});
        }
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            user.role = 'admin';
            await user.save();
        } else {
            user.role = 'usuario';
            await user.save();
        }

        req.session.user = user;
        res.redirect('/products');
    } catch (error) {
        res.status(400).send({error});
    }
});

sessionRoutes.post('/logout', async(req, res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                return res.status(500).json({message: 'Logout failed'});
            }
        });
        res.send({redirect: 'http://localhost:8080/login'});
    } catch (error) {
        res.status(400).send({error});
    }
});


export default sessionRoutes;