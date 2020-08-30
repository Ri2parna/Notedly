// express server
const express = require("express");
// graphql server
const { ApolloServer } = require("apollo-server-express");
// imports from .env file
require("dotenv").config();
// import the json web token
const jwt = require("jsonwebtoken");
// get the user info from a jsonwebtoken
const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new Error("Session Invalid");
    }
  }
};

// Local module exports
const typeDefs = require("./schema");
const db = require("./db");
const models = require("./models");
const resolvers = require("./resolvers");
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
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    // console.log(user);
    return { models, user };
  },
});
// apply graphql middleware
server.applyMiddleware({ app, path: "/api" });

// start listening for requests
app.listen({ port }, () =>
  console.log(`GraphQL server running at ${port} ${server.graphqlPath}`)
);
