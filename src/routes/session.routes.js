import { Router } from "express";
import {
  postSessionRegister,
  postSessionLogin,
  postSessionLogout,
  postSessionRestorePassword,
  getCurrentUser,
} from "../controllers/session.controllers.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import passport from "passport";
import { generateToken } from "../config/jwt.config.js";
import bcrypt from "bcrypt";

const sessionRoutes = Router();

sessionRoutes.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  postSessionRegister
);
sessionRoutes.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  postSessionLogin
);
sessionRoutes.post("/logout", postSessionLogout);
sessionRoutes.post("/restore-password", postSessionRestorePassword);
sessionRoutes.get("/current", getCurrentUser);

// sessionRoutes.post("/register", async (req, res) => {
//   const { first_name, last_name, email, age, password } = req.body;
//   const user = await userModel.findOne({email});
//   if(user){
//     return res.status(400).send({message: "User already exist"})
//   }
//   const newUser = {
//     first_name,
//     last_name,
//     email,
//     age,
//     password: createHash(password)
//   }
//   await userModel.create(newUser);
//   delete newUser.password;
//   const accessToken = generateToken(newUser);
//   res.status(201).send({accessToken, message: "Created"})
// });

//  sessionRoutes.post("/login", async (req, res) => {
//    const {email, password} = req.body;
//    const user = await userModel.findOne({email});
//    if(!user || !isValidPassword(user, password)){
//     return res.status(401).send({message: "Not authorized"});
//    }
//    user.password = "";
//    const accessToken = generateToken(user);
//    res.send({status: "succes", accessToken});
//    });

//  sessionRoutes.post('/login', async(req, res) => {
//    const {email, password} = req.body;
//    try {
//        const user = await userModel.findOne({email});
//        if(!user){
//            return res.status(404).json({message: 'User not found'});
//        }
//        const passwordMatch = await bcrypt.compare(password, user.password);
//        if (!passwordMatch) {
//          return res.status(401).send({ message: 'Invalid credentials' });
//        }
//        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
//            user.role = 'admin';
//            await user.save();
//        } else {
//            user.role = 'usuario';
//            await user.save();
//        }

//        req.session.user = user;
//        res.redirect('/products');
//    } catch (error) {
//        res.status(400).send({error});
//    }
//  });

sessionRoutes.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);

sessionRoutes.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

export default sessionRoutes;
