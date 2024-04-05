import { userModel } from "../../models/user.model.js";

export default class Users {

    getUsers = async () => {
        try {
            const users = await userModel.find();
            return users;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    getUser = async (user) => {
        try {
            const result= await userModel.findOne({email: user});
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    getUserById = async (id) => {
        try {
            const result= await userModel.findOne({_id: id});
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    createUser = async (user) => {
        try {
            const result = await userModel.create(user);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    updateUser = async (id, user) => {
        try {
            const result = await userModel.findOneAndUpdate({_id: id}, {$set: user});
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    getUserToken = async (token) => {
        try {
            const result = await userModel.findOne({"tokenPassword.token": token});
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}