import React, { useState, useEffect } from 'react';
import { editPost, getPostById } from '../../services/post.services'; 
import { Button, Form, } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

// const postId = '-NbKxeTPPijksjZobtDT';

const EditPost = () => {
  const [post, setPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedTopic, setEditedTopic] = useState('');
  const [editedContent, setEditedContent] = useState('');

  const params = useParams();
  const currentPostID = params.id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData = await getPostById(currentPostID);
        setPost(postData);
        setEditedTitle(postData.title);
        setEditedTopic(postData.topic)
        setEditedContent(postData.content);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();
  }, [currentPostID]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await editPost(currentPostID, editedTitle, editedTopic, editedContent); 
      console.log('Post updated successfully!');
      navigate(`/detailed-post-view/${currentPostID}`)

    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Edit Post</h1>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group controlId="editTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />

          </Form.Group>
        <Form.Group controlId="editTopic">
          <Form.Label>Topic</Form.Label>
          <Form.Control
            as="textarea"
            rows={1}
            value={editedTopic}
            onChange={(e) => setEditedTopic(e.target.value)}
          />

        </Form.Group>
        <Form.Group controlId="editContent">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </Form.Group>
        <hr/>

        <div className="row">
        <div className="col-2">
        <Button type="submit"  variant="dark" onClick={() => navigate(`/detailed-post-view/${currentPostID}`)}>Back to post</Button>
        </div>
        <div className="col">
        <Button type="submit">Submit Changes</Button>
        </div>
        </div>

      </Form>
      
    </div>
  );
};

export default EditPost;
