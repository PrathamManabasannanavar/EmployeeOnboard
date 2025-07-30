const mongoose = require('mongoose')

const schema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

TaskSchema = mongoose.model('TaskSchema', schema)

module.exports = TaskSchema