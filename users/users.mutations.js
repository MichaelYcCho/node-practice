import bcrypt from "bcrypt";
import client from "../client"

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
        login: async (_, { username, password }) => {
            const user = await client.user.findFirst({ where: { username } });
            if (!user) {
                return {
                    ok: false,
                    error: "User not Found",
                };
            }
            const passwordOk = await bcrypt.compare(password, user.password)
            if (!passwordOk) {
                return {
                    ok: false,
                    error: "Incorrect password",
                }
            }
        },
    },
};

/* 또는 or을 사용해 아래처럼 구현가능
const existingUser = await client.user.findFirst({
    where: {
        OR: [
            { username, },
            { email, }
        ]
    }
});
if (existingUser) {
    throw new Error("This username/email is already taken")
}
*/