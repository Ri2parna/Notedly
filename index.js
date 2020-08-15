const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const port = process.env.PORT || 4000 ;


// schema
const typeDefs = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    hello: String!
    notes: [Note!]!
    note(id: ID!): Note!
  }

  type Mutation {
    newNote(content: String!): Note!
  }
  `;

let notes = [
{
  id: '1',
  author: 'adam scott',
  content: 'This is another note to be added to the list.'
},
{
  id: '2',
  author: 'adil scott',
  content: 'This is not another note to be added to the list.'
},
{
  id: '3',
  author: 'saddam scott',
  content: 'This is another ransom note to be added to the list.'
}
]

// resolver
const resolvers = {
  Query: {
    hello: () => 'Hello World!',
    notes: () => notes,
    note: (parent, args) => {
      return notes.find(note => note.id === args.id);
    },
  },
  Mutation: {
    newNote: (parent, args) =>{
      let noteToAdd = {
        id: String(notes.length + 1),
        content: args.content,
        author: 'alaska pierrie'
      };
      notes.push(noteToAdd);
      return noteToAdd;
    }
  }
};

const app = express();


// apollo server setup
const server = new ApolloServer({ typeDefs, resolvers});
// apply graphql middleware
server.applyMiddleware({app, path: '/api'});


app.listen({ port }, () => 
  console.log(`GraphQL server running at ${ port } ${server.graphqlPath}`)
  );
