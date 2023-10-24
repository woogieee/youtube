const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    //저장위치
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    //파일명
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    //업로드 파일 지정
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        //업로드는 mp4만
        if(ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

// 비디오를 서버에 저장
router.post('/uploadfiles', (req, res) => {

    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err})
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
})

// 비디오 정보들을 DB에 저장
router.post('/uploadVideo', (req, res) => {

    const video = new Video(req.body)
    //VideoUploadPage.js에 variables에 있는 정보가 다 담김

    video.save((err, doc) => {
        //모든 정보들을 몽고DB에 저장
        if(err) return res.json({ success: false, err });
        res.status(200).json({success: true })
    })

})

//비디오를 DB에서 가져와서 클라이언트에 보낸다.
router.get('/getVideos', (req, res) => {

    Video.find()
    //Video 컬렉션 안에있는 모든 Video를 가져옴
        .populate('writer')
        //.populate를 해줘야 ('writer')안에 들어있는 모든 정보('writer')를 가져옴, 해주지 않으면 아이디만 가져올 수 있음
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })

})

// 썸네일 생성하고 비디오 러닝타임도 가져오기
router.post('/thumbnail', (req, res) => {
    
    let filePath = "";
    let fileDuration = "";
    
    // 비디오 정보 가져오기 on('end')의 fileDuration을 사용하기 위해서
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);  // all metadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });

    // 썸네일 생성
    ffmpeg(req.body.url)
    // 썸네일 파일명 생성
    .on('filenames', function (filenames) {
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    // 썸네일을 생성하고 무엇을 할 것인지
    .on('end', function () {
        console.log('Screenshots taken');
        return res.json({ success: true, url: filePath, fileDuration: fileDuration});
    })
    // 에러 발생시
    .on('error', function (err) {
        console.error(err);
        return res.json({ success: false, err });
    })
    // 스크린샷 옵션
    .screenshots({
        // Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        // '%b': input basename (filename w/o extension)
        filename: 'thumbnail-%b.png'
    })
})

// 비디오 상세페이지로 이동
router.post('/getVideoDetail', (req, res) => {

    //Video model을 이용해서 클라이언트에서 보낸 ID를 이용해서 비디오를 찾음
    Video.findOne({ "_id" : req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err);
            return res.status(200).json({ success: true, videoDetail })
        })
})

// 구독한 비디오 가져오기
router.post('/getSubscriptionVideos', (req, res) => {

    // 자신의 ID를 가지고 구독하는 사람들을 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom })
    .exec(( err, subscriberInfo ) => {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];

        //subscribedUser에 userTo정보를 다 넣어줌
        subscriberInfo.map((subscriber, i) => {
            subscribedUser.push(subscriber.userTo);
        })

        // 찾은 사람들의 비디오를 가지고 온다.
        Video.find({ writer: { $in: subscribedUser }})
        //$in 몽고DB기능 - 구독하는 유저의 모든 아이디를 가져옴
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
    })



})



module.exports = router;