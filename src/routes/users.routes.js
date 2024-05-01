import { Router } from "express";
import Users from "../dao/mongo/users.mongo.js";

const usersRouter = Router();
const userService = new Users();

usersRouter.get("/premium", async (req, res) => {
    try {
        const user = await userService.getUser(req.user.email);
        if (req.user.rol === "premium") {
            user.rol = "user"
            user.save();
            res.send({message: "Rol updated"});
        } else {
            user.rol = "premium"
            user.save();
            res.send({message: "Rol updated"});
        }
    } catch (error) {
        req.logger.error(error);
        res.status(400).send({error});
    }
});

export default usersRouter;