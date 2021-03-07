import bcrypt from "bcrypt";
import client from "../../client"

export default {
    Mutation: {
        createAccount: async (_, { firstName, lastName, username, email, password }
        ) => {
            try {
                const existingUsername = await client.user.findFirst({
                    where: { username },
                });
                const existingEmail = await client.user.findFirst({
                    where: { email },
                });
                if (existingEmail && existingUsername) {
                    throw new Error("Username and Email is alredy taken");
                } else if (existingUsername) {
                    throw new Error("Username is already taken");
                } else if (existingEmail) {
                    throw new Error("Email is already taken");
                }
                //check if username or email are already on DB,

                const uglyPassword = await bcrypt.hash(password, 10)
                return client.user.create({
                    data: {
                        username,
                        email,
                        firstName,
                        lastName,
                        password: uglyPassword
                    }
                })

            } catch (e) {
                console.log(e)

            }
        },
    },
};

