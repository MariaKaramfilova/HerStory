import React, { useContext, useState } from 'react'
import { Button, Container, Col, Row, ToggleButtonGroup, ToggleButton, Alert, Card } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { createPost } from '../../services/post.services.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import DropzoneComponent from '../Dropzone/Dropzone.jsx';

export default function CreatePost() {
  // Need to import theme
  const { user, userData } = useContext(AuthContext);

  const [isTypeText, setIsTypeText] = useState(true);
  const [postTopic, setPostTopic] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postFile, setPostFile] = useState('');
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(null);


  // const handleFileChange = (e) => {
  //   if (e.target.files) {
  //     setPostFile(e.target.files[0]);
  //   }
  // };
  // console.log(postFile);

  function handleSubmit(event) {
    event.preventDefault();
    setError(null)
    setIsCompleted(false)

    if (postTitle.length < 16 || postTitle.length > 64) {
      setError('The title must be between 16 and 64 symbols.')
      return;
    }
    if ((postDescription.length < 32 || postDescription.length > 8192) && isTypeText) {
      setError('The post content must be between 32 symbols and 8192 symbols.')
      return;
    }

    const formContent = new FormData();
    formContent.append('file', postFile);

    const userName = Object.values(userData).filter(el => el.uid === user.uid)[0].username;

    createPost(postTitle, postDescription, postTopic, postFile, userName)
      .then(() => setIsCompleted(true))
      .catch(err => setError(err))
  }

  if (isCompleted) {
    return (
      <Container className='align-items-center justify-content-center w-100' style={{ minHeight: "100vh", maxWidth: "60%" }}>
        <Card className='align-items-center justify-content-center mx-auto my-auto' style={{ maxWidth: "60%" }}>
          <Alert className='text-center mt-4' variant='success'>Congrats, you just created a new post!</Alert>
          <h5 className='text-center mb-4'>Track the activity on your post in <Link to='/'>My account</Link></h5>
        </Card>
      </Container>
    )
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
      upvoted: [uuid, uuid] (set, array?)
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
    <Container className='align-items-center justify-content-center w-100' style={{ minHeight: "100vh", maxWidth: "60%" }}>
      <h2 className='text-center mb-4'>Create a post</h2>
      <Form>
        {error && <Alert variant='danger'>{error}</Alert>}
        <Form.Group>
          <Row className='mb-3'>
            <Col>
              <Form.Select aria-label='Choose topic' onChange={(e) => setPostTopic(e.target.value)} required>
                <option>Choose topic</option>
                <option>One</option>
                <option>Two</option>
                <option>Three</option>
              </Form.Select>
            </Col>
            <Col>
              <ToggleButtonGroup type="radio" name="options" defaultValue={1} className='w-100'>
                <ToggleButton id="tbg-radio-1" value={1} onClick={() => setIsTypeText(true)}>Text post</ToggleButton>
                <ToggleButton id="tbg-radio-2" value={2} onClick={() => setIsTypeText(false)}>Image/video post</ToggleButton>
              </ToggleButtonGroup>
            </Col>
          </Row>
          <Form.Control type="text" placeholder="Add post title" onChange={(e) => setPostTitle(e.target.value)} required className='mb-3' />
        </Form.Group>
        {isTypeText ? (<Form.Group className='mb-3'>
          <Form.Control as="textarea" placeholder="Write post description" onChange={(e) => setPostDescription(e.target.value)} style={{ minHeight: '30vh' }} />
        </Form.Group>) :
          (<DropzoneComponent setFile={setPostFile}/>)}
        <Button type="submit" data-testid="create-post-btn" onClick={handleSubmit}>Create post</Button>
      </Form>
    </Container>
  )
}


// (<Form.Group controlId="formFile" className="mb-3 " >
//             <Form.Control type="file" required onChange={handleFileChange} style={{ minHeight: '30vh' }} />
//           </Form.Group>)
