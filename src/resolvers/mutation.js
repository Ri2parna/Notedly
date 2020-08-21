const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
var gravatar = require('gravatar');
require('dotenv').config();

module.exports = {
    newNote: async(parent, args, { models }) => {
        return await models.Note.create({
            content: args.content,
            author: 'alaska pierrie'
        })
    },
    deleteNote: async(parent, { id }, { models }) => {
        try {
            await models.Note.findOneAndRemove({ _id: id });
            return true;
        } catch (err) {
            return false;
        }
    },
    updateNote: async(parent, { content, id }, { models }) => {
        await models.Note.findOneAndUpdate({ _id: id }, { $set: { content } }, { new: true });
    },
    signUp: async(parent, { username, email, password }, { models }) => {
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
                password: hashed
            });
            // create a web token and return 
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        } catch (err) {
            console.log(err);
            throw new Error('Error creating the account');
        }
    },
    signIn: async(parent, { username, email, password }, { models }) => {
        if (email) {
            email = email.trim().toLowerCase();
        }
        const user = await models.User.findOne({
            $or: [{ email }, { username }]
        })
        if (!user) {
            throw new AuthenticationError("Failed to sign in user");
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AuthenticationError("Failed to sign in user");
        }

        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    }
}