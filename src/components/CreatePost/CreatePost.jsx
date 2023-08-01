import React, { useEffect, useRef, useState } from 'react'
import { Button, Container, Col, Row, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { Form } from 'react-bootstrap'

export default function CreatePost() {
  // Need to import theme
  // Need import user

  const [isTypeText, setIsTypeText] = useState(true);
  const [postTopic, setPostTopic] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postFile, setPostFile] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setPostFile(e.target.files[0]);
    }
  };

  /**
   * const formContent = new FormData();
  formContent.append('file', uploadedFile);
   */

  function handleSubmit(event) {
    event.preventDefault();

  }
  /** 
    const forumPost = {
      headline: 'test',
      text: 'test',
      author: {
          userName: 'John',
          memberSince: '05.12.2021',
          post: '72',
          rank: 'Rookie',
          likedPosts: [{}, {}],
          postedPosts: [{}, {}]
      },
      comments: [
          {
              upvoted: '3',
              author: {},
              text: 'test',
              date: '28.07.2023'
          },
          {
              upvoted: '3',
              author: {},
              text: 'test',
              date: '28.07.2023'
          }
      ]
  }
  */
  return (
    <Container className='align-items-center justify-content-center' style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "60%" }}>
        <h2 className='text-center mb-4'>Create a post</h2>
        <Form>
          <Form.Group>
            <Row>
              <Col xs={7}>
                <Form.Select aria-label='Choose topic' onChange={(e) => setPostTopic(e.target.value)} required>
                  <option>Choose topic</option>
                  <option>One</option>
                  <option>Two</option>
                  <option>Three</option>
                </Form.Select>
              </Col>
              <Col>
                <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                  <ToggleButton id="tbg-radio-1" value={1} onClick={() => setIsTypeText(true)}>Text post</ToggleButton>
                  <ToggleButton id="tbg-radio-2" value={2} onClick={() => setIsTypeText(false)}>Image/video post</ToggleButton>
                </ToggleButtonGroup>
              </Col>
            </Row>
            <Form.Control type="text" placeholder="Add post title" onChange={(e) => setPostTitle(e.target.value)} required />
          </Form.Group>
          {isTypeText ? (<Form.Group>
            <Form.Control as="textarea" placeholder="Write post description" onChange={(e) => setPostDescription(e.target.value)} style={{ minHeight: '30vh' }} required />
          </Form.Group>) :
            (<Form.Group controlId="formFile" className="mb-3 " >
              <Form.Control type="file" required onChange={handleFileChange} style={{ minHeight: '30vh' }} />
            </Form.Group>)}
          <Button type="submit" onClick={handleSubmit}>Create post</Button>
        </Form>
      </div>
    </Container>
  )
}
