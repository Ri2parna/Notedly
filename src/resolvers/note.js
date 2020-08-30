module.exports = {
  author: async (note, args, { models }) => {
    return await models.User.findById(note.author);
  },
  favoritedBy: async (note, args, { models }) => {
    return await models.Note.find({ _id: { $in: note.favoritedBy } });
  },
};

// functionality for running nested query
