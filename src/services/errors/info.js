export const generateUserErrorInfo = (user) => {
    return `One or more properties are imcomplete or invalid
        first_name: needs to be a string, received ${typeof user.first_name}
        last_name: needs to be a string, received ${typeof user.last_name}
        age: needs to be a string, received ${typeof user.age}
        email: needs to be a string, received ${typeof user.email}
    `
}