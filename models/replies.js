const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    text: {
        type: String,
        required: true
    },
    delete_password: {
        type: String,
        required: true
    },
    reported:{
        type: Boolean,
        default: false
    },
    thread: {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    }
}, {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }
});

const Thread = mongoose.model('Reply', replySchema);
module.exports = Thread
