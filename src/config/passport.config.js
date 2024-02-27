import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/db/models/user.model.js";
import cartModel from "../dao/db/models/cart.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { Strategy as GithubStrategy } from "passport-github2";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, cart } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          let role = "usuario";

          if (
            req.body.email === "adminCoder@coder.com" &&
            req.body.password === "adminCod3r123"
          ) {
            role = "admin";
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            cart,
            password: createHash(password),
            role,
          };

          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error to obtain the user " + error);
        }
      }
    )
  );
};

passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
          console.log("User doenst exists");
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: "Iv1.faa37dc1a7056b94",
      callbackURL: "http://localhost:8080/api/session/githubcallback",
      clientSecret: "1509be9c91176650201170ad33a1fde959231f06",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log({ profile });
        const user = await userModel.findOne({ email: profile._json.email });
        if (!user) {
          const newUser = {
            first_name: profile._json.name.split(" ")[0],
            last_name: profile._json.name.split(" ")[1],
            age: 18,
            email: profile._json.email,
            passport: "GithubGenerated",
          };
          console.log(profile._json);
          const result = await userModel.create(newUser);

          const newCart = await cartModel.create({
            id: "GitHubGeneratedCart",
            products: [],
          });

          result.cart = newCart._id;
          await result.save();

          return done(null, result);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findOne({ _id: id });
  done(null, user);
});

export default initializePassport;
