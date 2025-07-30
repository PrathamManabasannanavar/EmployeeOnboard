const mongoose = require('mongoose')

schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        // unique: true
    },
    name: {
        type: String,
        required: true,
    },
    // salary: {
    //     type: Number,
    //     required: true
    // },
})


employee = mongoose.model('employee', schema)

module.exports = employee