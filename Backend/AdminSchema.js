const mongoose = require('mongoose')

const schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    }
})

AdminLogin = mongoose.model('AdminLogin', schema)

module.exports = AdminLogin