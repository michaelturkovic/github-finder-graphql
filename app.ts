import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const PORT: number = 4000;

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
    Query: {
      hello: () => 'Hello world!',
    },
  };

const server: ApolloServer = new ApolloServer({ typeDefs, resolvers });
 
const app: express.Application = express();
server.applyMiddleware({ app });
 
app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);