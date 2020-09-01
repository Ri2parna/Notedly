const Mutation = require("./mutation");
const Query = require("./query");
const GraphQLDatetime = require("graphql-iso-date");
const Note = require("./note");
const User = require("./user");

module.exports = {
  Query,
  Mutation,
  Note,
  User,
  DateTime: GraphQLDatetime,
};
