const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    //비디오 정보
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //댓글 작성자
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    //대댓글시 원 댓글 작성자
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //댓글 내용
    content: {
        type: String
    },

}, { timestamps: true})


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }