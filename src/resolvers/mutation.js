const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");
var gravatar = require("gravatar");
require("dotenv").config();

module.exports = {
  newNote: async (parent, args, { models, user }) => {
    // throw error if not signed in
    if (!user) {
      throw new AuthenticationError("You must be signed in to create a note");
    }
    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("You must be signed in to delete the note");
    }
    // matching note owner and current user
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError(
        "You don't have the permissions to delete the note"
      );
    }
    try {
      await note.remove();
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("You must be signed in to update a note");
    }
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError(
        "You don't have permissions to update this note"
      );
    }
    await models.Note.findOneAndUpdate(
      { _id: id },
      { $set: { content } },
      { new: true }
    );
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    email = email.trim().toLowerCase();
    // hash the password
    // 10 is the no of salt rounds
    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email);
    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      });
      // create a web token and return
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      throw new Error("Error creating the account");
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }
    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      throw new AuthenticationError("Failed to sign in user");
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError("Failed to sign in user");
    }
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
  toggleFavorite: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("You must be signed in to faviourate this");
    }
    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);
    if (hasUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: -1,
          },
        },
        {
          new: true,
        }
      );
    } else {
      // if the user hasn't favorited it yet
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: 1,
          },
        },
        {
          new: true, // this is done to update the document
        }
      );
    }
  },
};
