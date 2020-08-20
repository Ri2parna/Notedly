const Mutation = require('./mutation');
const Query = require('./query');
const GraphQLDatetime = require('graphql-iso-date');


module.exports = {
    Query,
    Mutation,
    DateTime: GraphQLDatetime
};