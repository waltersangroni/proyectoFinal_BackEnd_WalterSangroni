import { createHash } from "../utils/bcrypt.js";

class UserDTO {
    constructor(user){
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.fullName = `${this.first_name} ${this.last_name}`;
        this.active = true;
        this.email = user.email;
        this.password = createHash(user.password);
        this.age = user.age;
        this.cart = user.cart;
        this.role = user.role;
    }

    getCurrentUser() {
        return {
            fullName: `${this.first_name} ${this.last_name}`,
            email: this.email,
            age: this.age,
            cart:this.cart,
            rol: this.role
        }
    }
}

export default UserDTO;