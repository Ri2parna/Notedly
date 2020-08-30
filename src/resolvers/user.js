module.exports = {
  // resolves / returns a list of nodes for a user when requested
  notes: async (user, args, { models }) => {
    return await models.Note.find({ author: user._id }).sort({ _id: -1 });
  },
  // resolve the list of favorites for a user when asked
  favorites: async (user, args, { models }) => {
    return await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
  },
};

// functionality for running nested query
