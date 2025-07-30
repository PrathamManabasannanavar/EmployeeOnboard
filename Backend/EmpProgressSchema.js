const mongoose = require('mongoose')

const schema = mongoose.Schema({
    taskId: {
        type: Number,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    progress: {
        type: String,
        default: "not started",
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
})

const EmpProgress = mongoose.model('EmpProgress', schema)

module.exports = EmpProgress