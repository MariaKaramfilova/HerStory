import { createComment, getCommentsByPostHandle, deleteCommentID, upvotePost, getPostById, deletePost } from "../../services/post.services"
import { Alert, Button, Form } from 'react-bootstrap'
import { AuthContext } from '../../context/AuthContext.js';
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, } from 'react-router-dom';
import MyAccount from "../Account/Account";
import Comment from "../../components/Comments/Comments";
import { getUserData, fromUsersDocument } from "../../services/users.services";

// const demoPost = {
//     author: 'testingM',
//     content: 'Hi everyone, I’m new to this forum and I wanted to share my story and get some advice. I’m a 25-year-old woman who works as a software engineer at a tech company. I love my job and I’m good at it, but I feel like I’m constantly facing discrimination and harassment from my male colleagues and managers. They make sexist jokes, interrupt me during meetings, take credit for my work, and exclude me from important projects. They also pay me less than the men who have the same qualifications and experience as me. I’ve tried to report these issues to HR, but they always dismiss them or blame me for being too sensitive or not fitting in. I don’t know what to do. I want to advance in my career and be respected for my skills, but I also don’t want to quit my job and lose my income. How can I deal with this situation? Has anyone else faced something similar? Thanks for listening.',
//     createdOn: 1691511859021,
//     email: 't@t.com',
//     postId: '-NbKxeTPPijksjZobtDT',
//     title: 'Sharing my story with the world',
//     topic: 'Gender Equality',
// }

export default function DetailedPostView() {

  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [commentsLibrary, setCommentsLibrary] = useState([]);
  const [refreshComments, SetRefreshComments] = useState(true)
  const [post, setPost] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [error, setError] = useState(null);

  const params = useParams();
  const currentPostID = params.id;
  const loggedUserID = user.uid;

  const postId = currentPostID || '-NbKxeTPPijksjZobtDT';

  const navigate = useNavigate();

  useEffect(() => {
    getPostById(postId)
      .then(currentPost => {
        setPost(currentPost);
        return getCommentsByPostHandle(postId);
      })
      .then(comments => {
        setCommentsLibrary(comments);
      })
      .then(() => {
        return getUserData(user.uid);
      })
      .then(snapshot => {
        return fromUsersDocument(snapshot);
      })
      .then(user => {
        const filtered = Object.values(user).filter(el => el.uid === loggedUserID)
        setCurrentUser(filtered[0]);
      })
      .catch(error => {
        console.error('Error fetching post and comments:', error);
      });
  }, [refreshComments]);

  const postDate = new Date(post.createdOn);


  console.log(currentUser);


  async function submitComment(e) {
    e.preventDefault();
    if (currentUser.blockedStatus) {
      setError('You cannot add comments because you are a blocked user!');
      return;
    }

    await createComment(comment, currentUser.username, post.postId, currentUser.uid)
    alert('comment submitted')
    setComment('')
    SetRefreshComments(!refreshComments)
  }

  // async function upvote(handle, postId) {
  //     try{
  //         upvotePost(handle, postId)
  //         console.log('post has been liked');
  //     }catch(error){
  //         alert(error)
  //     }
  // }


  // async function removeUpvote (){
  //     //to be implemented
  // }

  function handleEdit(e) {
    e.preventDefault();
    navigate(`/edit-post/${postId}`);
  }

  async function handleDeletePost(e) {
    e.preventDefault();
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');

    if (confirmDelete) {
      try {
        await deletePost(postId);
        alert('Your post has been deleted!')
        navigate('/home')
      } catch (error) {
        alert(error)
      }
    }

  }


  const commentsToShow = commentsLibrary.length > 0 ? (
    commentsLibrary.map((comment) => (
      <Comment key={crypto.randomUUID()} author={comment.author} createdOn={comment.createdOn} content={comment.content}
        commentUserUid={comment.userUid} commentId={comment.commentId} SetRefreshComments={SetRefreshComments} refreshComments={refreshComments} />
    ))
  ) : (
    <p>There are no comments, yet. You can write the first one.</p>
  );

  return (

    <div className="container-auto mt-3">

      {/* <h7>{demoPost.topic}</h7> */}
      <div className="row">

        <div className="col-8">

          <h6>Posted by {post.author} on {postDate.toLocaleString()} | {post.topic}</h6>
        </div>
        {post.author === currentUser.username && (
          <div className="col">
            <Button type="submit" className='mt-1' variant="dark" onClick={handleEdit}>Edit Post</Button>
          </div>
        )}

        {(currentUser.role === 'admin' || post.author === currentUser.username) && (
          <div className="col">
            <Button type="submit" className='mt-1' variant="dark" onClick={handleDeletePost}>Delete Post</Button>
          </div>)}
      </div>

      <row className="mt-1">
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </row>

      {user ? (
        <div className="row">
          <div className="col-2">
            <Button type="submit" variant="danger" onClick={() => upvote(post.author, post.postId)}>Upvote Post</Button>
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
            <Button type="submit" variant="danger" onClick={submitComment}>Add Comment</Button>
          </div>
        </div>
      ) : (
        <> <hr />
          <p> Log in to write a comments, upvote or downvote posts and be part of our community. </p>  </>)}
      {error && <Alert variant='danger'>{error}</Alert>}
      <hr />
      <h2>Comments</h2>
      {commentsToShow}
    </div>

  )
}

