
import bcrypt from "bcrypt";
import client from "../../client";

export default {
    Mutation: {
        createAccount: async (
            _,
            { firstName, lastName, username, email, password }
        ) => {
            // Check Username or Email is already taken
            const existingUsername = await client.user.findFirst({
                where: { username },
            });
            const existingEmail = await client.user.findFirst({
                where: { email },
            });
            // return error if username or email is already taken
            if (existingEmail || existingUsername) {
                return {
                    success: false,
                    error:
                        existingEmail && existingUsername
                            ? "Username and Email is already taken"
                            : existingUsername
                                ? "Username is already taken"
                                : "Email is already taken",
                };
            }
            // hashing password for security
            const hashedPassword = await bcrypt.hash(password, 10);
            // create User
            const user = await client.user.create({
                data: {
                    firstName,
                    lastName,
                    username,
                    email,
                    password: hashedPassword,
                },
            });
            // return User with ok
            return {
                success: true,
                user,
            };
        },
    },
};