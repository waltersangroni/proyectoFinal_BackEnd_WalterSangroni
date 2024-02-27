import { userModel } from "../dao/db/models/user.model.js";

export const postSessionRegister = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    req.session.user = user;

    console.log("User created successfully");
    res.redirect("/");
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .send({ message: `Internal Server Error: ${error.message}` });
  }
};

export const postSessionLogin = async (req, res) => {
  if (!req.user) {
    return res.status(400).send({ message: "Error with credentials" });
  }
  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
  };
  res.redirect("/");
};

export const postSessionLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ redirect: "http://localhost:8080/login" });
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(400).send({ error });
  }
};

export const postSessionRestorePassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    user.password = createHash(password);
    await user.save();
    res.send({ message: "Password updated" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error });
  }
};

export const getSessionCurrent = async (req, res) => {
  try {
    // Verifica si el usuario está autenticado
    if (req.isAuthenticated()) {
      // Devuelve el usuario actual en la respuesta
      res.status(200).json(req.user);
    } else {
      // Si no hay usuario autenticado, devuelve un mensaje de error
      res.status(401).json({ message: "No hay usuario autenticado" });
    }
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
