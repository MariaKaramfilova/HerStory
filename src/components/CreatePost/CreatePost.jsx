import React, { useContext, useState } from 'react'
import { Button, Container, Col, Row, ToggleButtonGroup, ToggleButton, Alert } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { createPost, getAllPosts } from '../../services/post.services.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import DropzoneComponent from '../Dropzone/Dropzone.jsx';
import { TOPIC_EDUCATION, TOPIC_EQUALITY, TOPIC_MATERNITY, TOPIC_PAY, TOPIC_REPRO, TOPIC_VIOLENCE } from '../../common/common.js';
import Loading from '../../views/Loading/Loading.jsx';
import { PostsContext } from '../../context/PostsContext.js';
import Error from '../../views/Error/Error.jsx';

export default function CreatePost() {
  // Need to import theme
  const { loggedInUser } = useContext(AuthContext);
  const { allPosts, setAllPosts } = useContext(PostsContext);

  const [isTypeText, setIsTypeText] = useState(true);
  const [postTopic, setPostTopic] = useState('Choose topic');
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

    if (postTopic === 'Choose topic') {
      setError('You need to select post topic');
      setLoading(false);
      return;
    }
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

    const formContent = new FormData();
    formContent.append('file', postFile);

    const userName = loggedInUser.username;
    const userEmail = loggedInUser.email;
    const isBlocked = loggedInUser.blockedStatus;
    const userId = loggedInUser.uid;

    if (isBlocked) {
      setError('You cannot create post because you are a blocked user!');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        await createPost(postTitle, postDescription, postTopic, postFile, userName, userEmail, userId);
        let result = await getAllPosts();
        setAllPosts((prev) => ({ ...prev, allPosts: result }));
        setIsCompleted(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }

  if (isCompleted) {
    navigate('/success-posting')
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error error={error} />
  }

  return (
    <Container className='w-100 mt-3 mb-3' style={{ minHeight: "100vh", maxWidth: "60%", marginLeft: "0" }}>
      <h2 className='mb-4'>Create a post</h2>
      <Form>
        {error && <Alert variant='danger'>{error}</Alert>}
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
