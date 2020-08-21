const { gql } = require('apollo-server-express');

module.exports = gql `
  scalar DateTime
  type Note {
    id: ID!
    content: String!
    author: String!
    createdAt : DateTime! 
    updatedAt : DateTime!
  }

  type Query {
    notes: [Note!]!
    note(id: ID): Note!
  }

  type Mutation {
    newNote(content: String!): Note
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note!]!
  }
  `;