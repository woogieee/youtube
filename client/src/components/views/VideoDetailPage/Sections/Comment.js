import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function Comment(props) {

    const videoId = props.postId;

    //리덕스 훅으로 유저정보 가져오기
    const user = useSelector(state => state.user);

    const [commentValue, setCommentValue] = useState("")

    //타이핑 이벤트
    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    //Submit 버튼 클릭 이벤트
    const onSubmit = (event) => {
        event.preventDefault();
        //페이지 새로고침 X

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            //리덕스훅 에서 유저정보 가져오기
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.result)
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

        {/* Root Comment Form */}

        <form style={{ display: 'flex' }} onSubmit={onSubmit} >
            <textarea 
                style={{ width: '100%', borderRadius: '5px' }}
                onChange={handleClick}
                value={commentValue}
                placeholder="코멘트를 작성해 주세요"
            />
            <br />
            <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>

        </form>
    </div>
  )
}

export default Comment