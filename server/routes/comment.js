const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

//=================================
//             Comment
//=================================

//댓글 저장
router.post('/saveComment', (req, res) => {

    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if(err) return res.json({ success: false, err})

        //save를 했을경우 populate('writer')을 사용할 수 없음
        Comment.find({ '_id' : comment._id })
            .populate('writer')
            .exec((err, result) => {
                if(err) return res.json({ success: false, err })
                res.status(200).json({ success: true, result })
            })
    })

})

//비디오 댓글정보 가져오기
router.post('/getComments', (req, res) => {

    Comment.find({ "postId" : req.body.videoId})
    .populate('writer')
    .exec(( err, comments) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, comments })
    })

})


module.exports = router;