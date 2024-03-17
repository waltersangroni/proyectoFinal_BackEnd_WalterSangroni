import { Router } from "express";
import CustomErrors from "../services/errors/CustomError.js";
import { generateSingleUserError, generateUserErrorInfo, userNotFound } from "../services/errors/info.js";
import ErrorEnum from "../services/errors/error.enum.js";

const userRoutes = Router();

const users = [];
userRoutes.get("/", (req, res) => {
  res.send({ users });
});

userRoutes.post("/", (req, res) => {
  try {
    const { first_name, last_name, email, age } = req.body;
    if (!first_name || !last_name || !email || !age) {
      CustomErrors.createError({
        name: "User creation fails",
        cause: generateUserErrorInfo(req.body),
        message: "Error trying to create user",
        code: ErrorEnum.INVALID_TYPE_ERROR,
      });
    }
    const user = {
      first_name,
      last_name,
      email,
      age,
    };
    if (users.length === 0) {
      user.id = 1;
    } else {
      user.id = users[users.length - 1].id + 1;
    }
    users.push(user);
    res.send({ users });
  } catch (error) {
    CustomErrors.createError({
        name: "User creation fails",
        cause: generateUserErrorInfo(req.body),
        message: "Error trying to create user",
        code: -1,
      });
  }
});

export default userRoutes;