import React, { useState, useEffect, useContext } from 'react';
import { editPost, getPostById, addPostTags, removePostTags, getAllPosts } from '../../services/post.services';
import { Button, Form, } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import SelectCreatable from '../../components/SelectCreatable/SelectCreatable.jsx';
import { updateTags } from '../../services/tag.services.js';
import DropzoneComponent from '../../components/Dropzone/Dropzone';
import { PostsContext } from '../../context/PostsContext.js';

const EditPost = () => {
  const [post, setPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedTopic, setEditedTopic] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedFile, setEditedFile] = useState(null);
  const [tags, setTags] = useState([]);
  const { allPosts, setAllPosts } = useContext(PostsContext);

  const handleSelectChange = (e) => {
    setTags(e);
  }

  const handleFileChange = (e) => {
    setEditedFile(e.target.files[0]);
  }

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

        if (postData.file) {
          setEditedFile(postData.file); // Include edited file only if it exists
        }

      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();
  }, [currentPostID]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {

      await editPost(currentPostID, editedTitle, editedTopic, editedContent, editedFile);

      let tagsSimple;

      if (tags[0]) {
        tagsSimple = tags[0].map(el => el.value);
      }

      if (tags.length && tags[0]) {
        await addPostTags(currentPostID, tagsSimple);
        await updateTags(tagsSimple);
      }

      if (tags[1]) {
        const deletedTags = tags[1].filter(el => !tagsSimple.includes(el.value));
        await removePostTags(currentPostID, deletedTags);
      }

      console.log('Post updated successfully!');
      let result = await getAllPosts();
      setAllPosts((prev) => ({ ...prev, allPosts: result }));
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
        {post.content && <Form.Group controlId="editContent">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </Form.Group>}

        {post.file && (<DropzoneComponent setFile={setEditedFile} />)}

        <Form.Label>Add post tags</Form.Label>
        <SelectCreatable changeTags={handleSelectChange} post={post} />
        <hr />

        <div className="row">
          <div className="col-2">
            <Button type="submit" variant="dark" onClick={() => navigate(`/detailed-post-view/${currentPostID}`)}>Back to post</Button>
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