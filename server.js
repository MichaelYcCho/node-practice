require('dotenv').config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { getUser, protectResolver } from './users/users.utils'

const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
        return {
            loggedInUser: await getUser(req.headers.token),
            protectResolver,
        }
    }
});

const PORT = process.env.PORT

server.listen(PORT).then(() => console.log(`http://localhost:${PORT}`));


const x = (resolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
        return {
            ok: false,
            error: "log in plz"
        }
    }
    return resolver(root, args, contxt, info);
}
