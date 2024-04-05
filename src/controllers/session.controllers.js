import { userModel } from "../dao/db/models/user.model.js";
import UserDTO from "../dtos/user.dto.js";
import MailingService from "../services/mailing.js";

const userService = new Users();
const mailingService = new MailingService();

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

// export const getSessionCurrent = async (req, res) => {
//   try {
//     if (req.isAuthenticated()) {
//       const user = new UserDTO(req.user);
//       res.status(200).json(user);
//     } else {
//       res.status(401).json({ message: "No hay usuario autenticado" });
//     }
//   } catch (error) {
//     console.error("Error al obtener el usuario actual:", error);
//     res.status(500).json({ message: "Error interno del servidor" });
//   }
// };

export const getCurrentUser = (req, res) => {
  const user = new UserDTO(req.user);
  res.send(user.getCurrentUser());
}

export const forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
      const tokenObj = generateToken();
      const user = await userService.getUser(email);
      await userService.updateUser(user._id, { tokenPassword: tokenObj });
      await mailingService.sendSimpleMail({
          from: "NodeMailer Contant",
          to: email,
          subject: "Cambiar contraseña",
          html: `
              <p>Haz clic en este <a href="http://localhost:8080/api/sessions/restore-password/${tokenObj.token}">enlace</a> para restablecer tu contraseña.</p>
          `
      });
      const emailSend = true;
      req.logger.info(`Email sent to ${email}`);
      res.render("forgot-password", { emailSend });
  } catch (error) {
      req.logger.error(error);
      res.status(400).send({error});
  }
};

export const restorePasswordToken = async (req, res) => {
  try {
      const { token } = req.params;
      const user = await userService.getUserToken(token);
      if (!user) {
          const newTitle = true;
          return res.render("forgot-password", { newTitle });
      }
      const tokenObj = user.tokenPassword;
      if (tokenObj && verifyToken(tokenObj)) {
          res.redirect("/restore-password");
      } else {
          const newTitle = true;
          res.render("forgot-password", { newTitle });
      }
  } catch (error) {
      req.logger.error(error);
      res.status(400).send({error});
  }
};
