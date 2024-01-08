import mongoose from "mongoose";

const dbConnect = async() => {
    const dbUrl = "mongodb+srv://walterhugosangroni:simon1003@coderbackend.nesyhds.mongodb.net/ecommerce";

    mongoose.connect(dbUrl)
    .then(() => {
        console.log("Conexión a la base de datos establecida con éxito");
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos:", error);
    });
}

export default dbConnect;