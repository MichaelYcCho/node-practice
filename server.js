require('dotenv').config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";


const server = new ApolloServer({
    schema,
    context: ({ req }) => {
        return {
            token: req.headers.token,
        }
    }
});

const PORT = process.env.PORT

server.listen(PORT).then(() => console.log(`http://localhost:${PORT}`));