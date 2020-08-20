// express server
const express = require('express');
// graphql server
const { ApolloServer } = require('apollo-server-express');
// imports from .env file
require('dotenv').config();

// Local module exports
const typeDefs = require('./schema');
const db = require('./db');
const models = require('./models');
const resolvers = require('./resolvers');
const port = process.env.PORT || 17074;
const DB_HOST = process.env.DB_HOST;

// express server
const app = express();
// start database connection
db.connect(DB_HOST);
// apollo server setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        return { models };
    }
});
// apply graphql middleware
server.applyMiddleware({ app, path: '/api' });

// start listening for requests
app.listen({ port }, () =>
    console.log(`GraphQL server running at ${ port } ${server.graphqlPath}`)
);