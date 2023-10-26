import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user);

    //Reply to Button 상태
    const [OpenReply, setOpenReply] = useState(false)
    //Comment 값
    const [CommentValue, setCommentValue] = useState("")

    //버튼을 클릭하면 토글되게
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }
    
    //코멘트창 입력 가능
    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }
    
    const onSubmit = (event) => {
        event.preventDefault();
        
        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            //리덕스훅 에서 유저정보 가져오기
            postId: props.postId,
            responseTo: props.comment._id
        }
        
        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.result)
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('코멘트를 저장하지 못했습니다.')
                }
            })
            
        }
        
    //Reply to Button
    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />
        ,<span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} />}
                content={<p>{props.comment.content}</p>}
            />
            {/* OpenReply가 true일 경우만 표시 */}
            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해 주세요"
                    />
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</Button>

                </form>            
            }

        </div>
    )
}

export default SingleComment