import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import { Card, ListGroup } from 'react-bootstrap'
import Posts from '../../components/Posts/Posts.jsx';
import { getUserByUsername, getUserData } from '../../services/users.services.js';
import { useLocation } from 'react-router-dom';


export default function MyAccount({ userName }) {

  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (location.pathname === '/my-account') {
      getUserData(user.uid)
      .then(snapshot => {
        const userData = snapshot.val(Object.keys(snapshot.val())[0]);
        const userInfo = Object.values(userData).filter(el => el.uid === user.uid)[0];
        setUserInfo(userInfo);
      });
      return;
    }


    getUserByUsername(userName)
      .then(snapshot => {
        const userData = snapshot.val(Object.keys(snapshot.val())[0]);
        const userInfo = Object.values(userData).filter(el => el.uid === user.uid)[0];
        setUserInfo(userInfo);
      });
  }, [user, location.pathname, userName]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">

          <div className="col-7">
            <h1>My Posts</h1>
            <Posts userName={userInfo.username} />
          </div>

          <div className="col-auto">
            <h1>Account Details</h1>
            {user && (
              <Card>
                <Card.Body>
                  <Card.Title>{userInfo.username}</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Email: {userInfo.email}</ListGroup.Item>
                    <ListGroup.Item>First Name: {userInfo.firstName}</ListGroup.Item>
                    <ListGroup.Item>Last Name: {userInfo.lastName}</ListGroup.Item>
                    {/* If the createdOn is a timestamp, you can format it accordingly */}
                    <ListGroup.Item>
                      Created On: {new Date(userInfo.createdOn).toLocaleString()}
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