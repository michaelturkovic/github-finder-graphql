import "reflect-metadata";
import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./src/resolvers/UserResolver";
import Logger from "./src/config/Logger";

const PORT: number = 4000;

const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true
  });

  const app: express.Application = express();

  const server: ApolloServer = new ApolloServer({
    schema,
    subscriptions: {
      path: "/subscriptions"
    },
    extensions: [() => new Logger()]
  });

  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: PORT }, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
    );
  });
};

startServer().catch(error => console.log(`ERROR: ${error.messae}`));
