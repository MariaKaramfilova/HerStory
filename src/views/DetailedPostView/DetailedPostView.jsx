import { createComment, getCommentsByPostHandle, deleteCommentID, likePost, dislikePost } from "../../services/post.services"
import { Button, Container, Col, Row, ToggleButtonGroup, ToggleButton, Alert, Card, Form } from 'react-bootstrap'
import { AuthContext } from '../../context/AuthContext.js';
import React, { useContext, useEffect, useState } from 'react'

const demoPost = {
    author: 'testingM',
    content: 'Hi everyone, I’m new to this forum and I wanted to share my story and get some advice. I’m a 25-year-old woman who works as a software engineer at a tech company. I love my job and I’m good at it, but I feel like I’m constantly facing discrimination and harassment from my male colleagues and managers. They make sexist jokes, interrupt me during meetings, take credit for my work, and exclude me from important projects. They also pay me less than the men who have the same qualifications and experience as me. I’ve tried to report these issues to HR, but they always dismiss them or blame me for being too sensitive or not fitting in. I don’t know what to do. I want to advance in my career and be respected for my skills, but I also don’t want to quit my job and lose my income. How can I deal with this situation? Has anyone else faced something similar? Thanks for listening.',
    createdOn: 1691511859021,
    email: 't@t.com',
    postId: 'NbKxeTPPijksjZobtDT',
    title: 'Sharing my story with the world',
    topic: 'Gender Equality',
}

export default function DetailedPostView () {
    const { user } = useContext(AuthContext);

    const [ comment, setComment ] = useState('');
    const [ commentsLibrary, setCommentsLibrary ] = useState([])

    const postDate = new Date(demoPost.createdOn);

    async function submitPost (){
        await createComment(comment, demoPost.author, demoPost.postId, user.uid)
        alert('comment submitted')
        setComment('')
    }

    async function addLike(handle, postId) {

        try{
            likePost(handle, postId)
            console.log('post has been liked');
        }catch(error){
            alert(error)
        }
        
    }

    async function removeLike (){
        
    }

    async function deleteComment (commentId) {
        await deleteCommentID(commentId);
    }

    useEffect (() => {

        async function fetchData() {
            try {
              const comments = await getCommentsByPostHandle(demoPost.postId);
              setCommentsLibrary(comments)

              } catch (error){
                alert(error)
              }
            }

            fetchData()

    }, [commentsLibrary])


    const commentsToShow = commentsLibrary.map((comment) => (
        <div key={comment.createdOn}>
          <p>Author: {comment.author}</p>
          <p>Created On: {new Date(comment.createdOn).toLocaleString()}</p>
          <p>{comment.content}</p>
          {user.uid === comment.userUid && 
  <Button type="submit" className='mt-3' variant="danger" onClick={() => deleteComment(comment.commentId)}>Delete Comment</Button>
          }
          <hr />
        </div>
    ));

    return (
  
        <div className="container-auto">
            <h7>Posted by {demoPost.author} on {postDate.toLocaleString()}</h7>
            {/* <h7>{demoPost.topic}</h7> */}
            <h1>{demoPost.title}</h1>
            <p>{demoPost.content}</p>

            <div className="row">
            <div className="col-2">
            <Button type="submit" className='mt-3' variant="danger"  onClick={()=> addLike(demoPost.author, demoPost.postId)}>Upvote Post</Button>
            </div>
            
            <div className="col-8">
            <Form.Group>
            <Form.Control 
            type="text" 
            placeholder="Add Comment" 
            value={comment} onChange={(e) => setComment(e.target.value)} 
            required className='mb-3' />
            </Form.Group>
            </div>

            <div className="col-2">
            <Button type="submit" className='mt-3' variant="danger" onClick={submitPost}>Add Comment</Button>
            </div>
            </div>
            <hr/>
            <h2>Comments</h2>
            {commentsToShow}
        </div>
    
    )
}

