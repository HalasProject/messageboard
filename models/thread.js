const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadSchema = new Schema({
    board: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    delete_password: {
        type: String,
        required: true
    },
    reported: {
        type: Boolean,
        default: false
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply',
    }],
    bumped_on:{
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;
