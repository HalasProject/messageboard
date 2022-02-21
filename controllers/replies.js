const Reply = require("../models/replies");
const Thread = require("../models/thread");

// list all threads on a board
async function list(req,res){
    const { thread_id } = req.query;

    const thread = Thread.findById(thread_id).populate('replies');
    
    thread.exec(function(err, thread){
        if(err) return res.status(500).send(err);
        res.json(thread);
    });

}

// create new reply
async function create(req,res){
    const {board} = req.params;
    const {text, delete_password, thread_id} = req.body;
    Reply.create({text,delete_password,thread:thread_id}, function(err, reply){
        Thread.findById(thread_id).exec(function(err, thread){
            if (err) return res.status(500).send(err);
            thread.replies.push(reply)
            thread.bumped_on = reply.creation_on;
            thread.save();
            res.json(reply);
        });
    });
    // res.redirect(`/b/${board}/${thread_id}`)
}

// delete a reply
async function destroy(req,res){
    const {delete_password,reply_id} = req.body;

    const reply = await Reply.findById(reply_id);
    if (reply) {
        if (reply.delete_password === delete_password) {
            await Thread.findByIdAndUpdate(reply_id,{text:"[deleted]"});
            return res.send('success');
        } else {
            return res.send('incorrect password');
        }
    }
    return res.status(500).send("Thread not found");
}

// report a reply
async function report(req,res){
    const {reply_id} = req.body;
    const reply = await Reply.findById(reply_id);
    if (reply) {
        reply.reported = true;
        await reply.save();
        return res.send('success');
    }
    return res.status(500).send("Reply not found");
}

module.exports = {list, create, destroy, report}