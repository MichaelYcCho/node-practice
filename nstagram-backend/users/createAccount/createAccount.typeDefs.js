import { gql } from "apollo-server";

export default gql`
  type CreateAccountResult {
    success: Boolean!
    error: String
    user: User
  }
  type Mutation {
    createAccount(
      firstName: String!
      lastName: String
      username: String!
      email: String!
      password: String!
    ): CreateAccountResult
  }
`;