require('dotenv').config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";


const server = new ApolloServer({
    schema,
    context: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE1MjE0OTA4fQ.ESB1UsflFIttMeszm_YlBjPjh-_gfqdnKnJthqKYiuA"
    }
});

const PORT = process.env.PORT

server.listen(PORT).then(() => console.log(`http://localhost:${PORT}`));