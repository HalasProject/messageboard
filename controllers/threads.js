const Thread = require("../models/thread");

// list all threads on a board
async function list(req,res){
    const { board } = req.params;
    const threads = Thread.find({board}).sort({bumped_on: -1}).limit(10).populate('replies').lean();

    threads.exec(function(err, threads){
        if(err) return res.status(500).send(err);
        threads.map(thread => thread.replycount = thread.replies.length);
        res.json(threads);
    });

}
// create new thread
async function create(req,res){
    const { board } = req.params;
    const {text, delete_password} = req.body;
    Thread.create({text,board,delete_password}, function(err, thread){
        if (err) return res.status(500).send(err);
        res.json(thread);
    });
    // res.redirect('back');
}

// delete a thread
async function destroy(req,res){
    const {delete_password,thread_id} = req.body;

    const thread = await Thread.findById(thread_id);
    if (thread) {
        if (thread.delete_password === delete_password) {
            await Thread.findByIdAndRemove(thread_id);
            return res.send('success');
        } else {
            return res.send('incorrect password');
        }
    }
    return res.status(500).send("Thread not found");
}

// report a thread
async function report(req,res){
    const {thread_id} = req.body;
    const thread = await Thread.findById(thread_id);
    if (thread) {
        thread.reported = true;
        await thread.save();
        return res.send('success');
    }
    return res.status(500).send("Thread not found");
}

module.exports = {list, create, destroy, report}