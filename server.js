import { ApolloServer, gql } from "apollo-server";


const typeDefs = gql`
    type Query{
        hello:String
    }
`;

const resolvers = {
    Query: {
        hello: () => "worlds",
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(() => console.log("http://localhost:4000"));