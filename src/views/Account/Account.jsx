import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import { Col, Container, Row, ToggleButton, ToggleButtonGroup, Card, ListGroup } from 'react-bootstrap'
import { getPostsByAuthor } from '../../services/post.services.js';
import { getUserData } from '../../services/users.services.js';
import PostsDetails from '../../components/Posts/PostsDetails.jsx';
import { useNavigate } from 'react-router-dom';


export default function MyAccount (props){

    const { user } = useContext(AuthContext);
    const [ userName, setUsername ] = useState('');
    const [ userDetails, setUserDetails ] = useState('');
    const [ posts, setPost ] = useState([]);
    const [ error, setError ] = useState(null);
    const navigate = useNavigate();

    // const [user] = useAuthState(auth);
    const uid = props.uid || user.uid;

    useEffect(() => {
        async function fetchData() {
          try {
            const userDataSnapshot = await getUserData(uid);
            const userData = userDataSnapshot.val();
            const userValues = Object.values(userData);
            const userWithMatchingUid = userValues.find((el) => el.uid === uid);

            if (userWithMatchingUid) {
              const { username } = userWithMatchingUid;
              setUsername(username);
              setUserDetails(userWithMatchingUid); // Set the userDetails state directly
    
              const posts = await getPostsByAuthor(username);
              setPost(posts);
            }
          } catch (error) {
            setError(error);
          }
        }
    
        fetchData();
      }, [uid]);

    console.log(userDetails);
    console.log(posts);
    console.log(userName);

    const postsToShow = posts.length ? (
        posts.map(post => {
          const postDetailsProp = {
            goToDetails: () => navigate(`/posts/${post.uid}`),
            ...post
          };
          return <PostsDetails key={post.uid} {...postDetailsProp} />;
        })
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )

    return (
        <>
        <div className="container-fluid">
        <div className="row">

        <div className="col-7">
        <h1>My Posts</h1>
        {postsToShow}
        </div>

        <div className="col-auto">
        <h1>Account Details</h1>
        {userDetails && (
        <Card>
          <Card.Body>
            <Card.Title>{userDetails.username}</Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>Email: {userDetails.email}</ListGroup.Item>
              <ListGroup.Item>First Name: {userDetails.firstName}</ListGroup.Item>
              <ListGroup.Item>Last Name: {userDetails.lastName}</ListGroup.Item>
              {/* If the createdOn is a timestamp, you can format it accordingly */}
              <ListGroup.Item>
                Created On: {new Date(userDetails.createdOn).toLocaleString()}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      )}
        </div>
       </div>
        </div>
        </>
    )

}

// MyAccount.propTypes = {
//     uid: PropTypes.string,
//   };