import Axios from 'axios'
import React, { useState } from 'react'
import { Button, Input } from 'antd';
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const { TextArea } = Input;


function Comment(props) {

    const videoId = props.postId;

    //리덕스 훅으로 유저정보 가져오기
    const user = useSelector(state => state.user);

    const [CommentValue, setCommentValue] = useState("")

    //타이핑 이벤트
    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    //Submit 버튼 클릭 이벤트
    const onSubmit = (event) => {
        event.preventDefault();
        //페이지 새로고침 X

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            //리덕스훅 에서 유저정보 가져오기
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.result)
                    setCommentValue("")
                    props.refreshFunction(response.data.result)
                } else {
                    alert('코멘트를 저장하지 못했습니다.')
                }
            })
    }
    
  return (
    <div>
        <br />
        <p> Replies </p>
        <hr />


        {/* Comment Lists */}

        {props.commentLists && props.commentLists.map((comment, index) => (
            (!comment.responseTo &&
                <React.Fragment>
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                    <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={videoId} commentLists={props.commentLists}/>
                </React.Fragment>
            )
        ))}

        {/* Root Comment Form */}

        <form style={{ display: 'flex' }} onSubmit={onSubmit} >
            <TextArea 
                style={{ width: '100%', borderRadius: '5px' }}
                onChange={handleClick}
                value={CommentValue}
                placeholder="코멘트를 작성해 주세요"
            />
            <br />
            <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</Button>

        </form>
    </div>
  )
}

export default Comment