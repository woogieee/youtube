const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const videoSchema = mongoose.Schema({
    
    //비디오를 업로드 한 유저
    writer: {
        type: Schema.Types.ObjectId,    //ID만 넣어도 User.js에서 모든 정보를 가져온다
        ref:'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true})
    //timestamps를 true로 함으로써 만든 날짜와 업데이트 날짜가 표시됨


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }