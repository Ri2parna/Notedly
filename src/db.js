const mongoose = require('mongoose');
module.exports = {
    connect: DB_HOST => {
        // use updated URL string parser
        mongoose.connect(DB_HOST, { useNewUrlParser: true });
        mongoose.connection.on('error', err => {
            console.log(err);
            console.log('MongoDB connection error. Is mongodb daemon running ?');
            process.exit();
        });
    },
    close: () => {
        mongoose.connection.close();
    }
}