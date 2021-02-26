import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
    type Movie{
        title: String
        yaer: Int
    }
    type Query{
        movies: [Movie]
        movie: Movie
    }
    type Mutation{
        createMovie(title: String!): Boolean
        deleteMovie(title: String!): Boolean
    }
`;

const resolvers = {
    Query: {
        movies: () => [],
        movie: () => ({ "title": "Hello", year: 2021 })
    },
    Mutation: {
        createMovie: (_, { title }) => {
            return true
        },
        deleteMovie: (_, { title }) => {
            return true
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(() => console.log("http://localhost:4000"));