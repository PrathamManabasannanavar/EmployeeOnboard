const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    }
})

EmployeeLogin = mongoose.model('EmployeeLogin', schema)

module.exports = EmployeeLogin
