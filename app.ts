import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./src/resolvers/UserResolver";
import Logger from './src/config/Logger';

const PORT: number = 4000;

const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true
  });

  const app: express.Application = express();

  const server: ApolloServer = new ApolloServer({
    schema,
    extensions: [() => new Logger()]
  });

  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer()
    .catch(error => console.log(`ERROR: ${error.messae}`));
