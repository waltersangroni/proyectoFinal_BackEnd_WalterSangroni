import { Router } from "express";

const viewsRouters = Router();

viewsRouters.get("/", (req, res) => {
    res.render("chat");
})

export default viewsRouters;