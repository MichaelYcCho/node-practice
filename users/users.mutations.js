export default {
    Mutation: {
        createAccount: (_,
            { firstName, lastName, username, email, password }
        ) => {
            //check if username or email are already on DB,
            //hash password
            //save and return the user

        },
    }
}