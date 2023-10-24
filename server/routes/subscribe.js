const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

//=================================
//             Subscribe
//=================================

// 비디오 정보들을 DB에 저장
router.post('/subscribeNumber', (req, res) => {

    Subscriber.find({ 'userTo': req.body.userTo })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
    })

})

router.post('/subscribed', (req, res) => {

    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        let result = false
        //userTo, userFrom 둘다 해당한다면
        if(subscribe.length !== 0) {
            result = true
        }
        res.status(200).json({ success: true, subscribed: result })
    })

})

//구독취소
router.post('/unSubscribe', (req, res) => {

    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom})
    .exec((err, doc) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true, doc })
    })

})

//구독하기
router.post('/subscribe', (req, res) => {

    const subscribe = new Subscriber(req.body)
    //불러온 모든 정보(userTo, userFrom)
    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })

})


module.exports = router;