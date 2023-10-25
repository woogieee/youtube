import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    //app.js에서 Route path를 /:videoId로 했기때문에 가져올 수 있음
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])

    const [Comments, setComments] = useState([])

    useEffect(() => {
        //비디오 상제정보 가져오기
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오기 실패했습니다.')
                }
            })

        //댓글을 위해 해당 비디오의 모든 Comment 정보 가져오기
        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if (response.data.success) {
                    setComments(response.data.comments)
                    console.log(response.data.comments)
                } else {
                    alert('코멘트 정보를 가져오지 못했습니다.')
                }
            })
    }, [])

    const refreshFunction = (newComment) => {
        //자식 컴포넌트 (Comment.js, SingleComment.js에서 Axios'/saveComment'로 보낸 코멘트 정보를 newComment로 받는다 )
        setComments(Comments.concat(newComment))
    }

    if (VideoDetail.writer) {

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
        //본인이 올린 비디오일경우 구독하기 버튼이 생성되지 않음.

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24} >
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%', height: '500px' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

                        {/* 구독버튼 */}
                        <List.Item
                            actions={[ <LikeDislikes video userId={localStorage.getItem('userId')}
                            videoId={videoId} />, subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>

                        {/* Comments */}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId} />
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {
        return (
            <div>
                ...Loading
            </div>
        )
    }


}

export default VideoDetailPage