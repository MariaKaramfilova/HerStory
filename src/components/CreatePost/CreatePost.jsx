import React, { useContext, useState } from 'react'
import { Button, Container, Col, Row, ToggleButtonGroup, ToggleButton, Alert, Card } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { createPost } from '../../services/post.services.js';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import DropzoneComponent from '../Dropzone/Dropzone.jsx';
import { TOPIC_EDUCATION, TOPIC_EQUALITY, TOPIC_MATERNITY, TOPIC_PAY, TOPIC_REPRO, TOPIC_VIOLENCE } from '../../common/common.js';
import { getUserData } from '../../services/users.services.js';
import Loading from '../Loading/Loading.jsx';

export default function CreatePost() {
  // Need to import theme
  const { user } = useContext(AuthContext);

  const [isTypeText, setIsTypeText] = useState(true);
  const [postTopic, setPostTopic] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postFile, setPostFile] = useState('');
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  async function handleSubmit(event) {
    event.preventDefault();
    setError(null)
    setIsCompleted(false)
    setLoading(true);

    if (postTitle.length < 16 || postTitle.length > 64) {
      setError('The title must be between 16 and 64 symbols.');
      setLoading(false);
      return;
    }
    if ((postDescription.length < 32 || postDescription.length > 8192) && isTypeText) {
      setError('The post content must be between 32 symbols and 8192 symbols.');
      setLoading(false);
      return;
    }

    if (!postFile && !isTypeText) {
      setError('The post must have a valid image or/video');
      setLoading(false);
      return;
    }

    if (postTopic === 'Choose topic') {
      setError('You need to select post topic');
      setLoading(false);
      return;
    }

    const formContent = new FormData();
    formContent.append('file', postFile);
    const snapshot = await getUserData(user.uid);
    const userData = snapshot.val(Object.keys(snapshot.val())[0]);

    const userName = Object.values(userData).filter(el => el.uid === user.uid)[0].username;

    createPost(postTitle, postDescription, postTopic, postFile, userName)
      .then(() => {
        setIsCompleted(true);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }

  if (isCompleted) {
    navigate('/success-posting')
  }

  if (loading) {
    return <Loading />
  }

  /** 
   * const user = {
          uuid: 55655666
          userName: 'John',
          memberSince: '05.12.2021',
          post: '72',
          rank: 'Rookie',
          likedPosts: [{}, {}],
          postedPosts: [id, id]
      }
    const forumPost = { 
      uuidPOst: 4566621
      headline: 'test',
      text: 'test',
      upvotedBy: {uuid: true, uuid: true} (set, array?)
      user/author: uuid of user,
      topic: ekjnskdfj,
  }
  const comment = {
    uuid: 6546512
    upvoted: '3',
    author: uuid,
    text: 'test',
    date: '28.07.2023'
    postId: 654665456
  }
  */
  return (
    <Container className='w-100 mt-3 mb-3' style={{ minHeight: "100vh", maxWidth: "60%", marginLeft: "0" }}>
      <h2 className='mb-4'>Create a post</h2>
      <Form>
        {error && <Alert variant='danger'>{error.message}</Alert>}
        <Form.Group>
          <Row className='mb-3'>
            <Col>
              <Form.Select aria-label='Choose topic' onChange={(e) => setPostTopic(e.target.value)} required>
                <option>Choose topic</option>
                <option>{TOPIC_EQUALITY}</option>
                <option>{TOPIC_EDUCATION}</option>
                <option>{TOPIC_MATERNITY}</option>
                <option>{TOPIC_PAY}</option>
                <option>{TOPIC_REPRO}</option>
                <option>{TOPIC_VIOLENCE}</option>
              </Form.Select>
            </Col>
            <Col>
              <ToggleButtonGroup type="radio" name="options" defaultValue={1} className='w-100'>
                <ToggleButton id="tbg-radio-1" value={1} onClick={() => setIsTypeText(true)} variant="secondary">Text post</ToggleButton>
                <ToggleButton id="tbg-radio-2" value={2} onClick={() => setIsTypeText(false)} variant="secondary">Image/video post</ToggleButton>
              </ToggleButtonGroup>
            </Col>
          </Row>
          <Form.Control type="text" placeholder="Add post title" onChange={(e) => setPostTitle(e.target.value)} required className='mb-3' />
        </Form.Group>
        {isTypeText ? (<Form.Group>
          <Form.Control as="textarea" placeholder="Write post description" onChange={(e) => setPostDescription(e.target.value)} style={{ minHeight: '30vh' }} />
        </Form.Group>) :
          (<DropzoneComponent setFile={setPostFile} />)}
        <Button type="submit" className='mt-3' variant="danger" data-testid="create-post-btn" onClick={handleSubmit}>Create post</Button>
      </Form>
    </Container>
  )
}
