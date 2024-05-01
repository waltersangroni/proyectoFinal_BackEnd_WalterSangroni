import { Router } from "express";

const testRouter = Router();

testRouter.get("/loggerTest", (req, res) => {
    req.logger.fatal("Esto es un error fatal");
    req.logger.error("Esto es un error ");
    req.logger.warning("Esto es un warning");
    req.logger.info("Esto es una info");
    req.logger.debug("Esto es un debug");
    res.send({message: "Errores enviados"});
});

export default testRouter;